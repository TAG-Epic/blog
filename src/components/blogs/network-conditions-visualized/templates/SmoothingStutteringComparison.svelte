<script lang="ts">
    import { BotPlayer } from "../networker/players/bot";
    import { NetworkedPlayer, SmoothingType } from "../networker/players/networked";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import PerspectiveVisualizer from "../PerspectiveVisualizer.svelte";
    import { PATH } from "../paths/basic-square";
    import { writable } from "svelte/store";
    import { onDestroy } from "svelte";
    import { FiddleAnalyticTracker } from "../fiddle-analytic";

    let tickRate = writable<number>(10);
    let pingMs = writable<number>(100);
    let packetLossPercent = writable<number>(5);
    let jitterMs = writable<number>(20);
    let extrapolate = writable<boolean>(false);
    
    let playersConfig = new Map<string, NetworkerPlayer>();
    let player1 = new BotPlayer({
        movementSpeed: 1,
        tickSpeed: 1,
        actions: PATH 
    });
    let player2 = new BotPlayer({
        movementSpeed: 1,
        tickSpeed: 1,
        actions: PATH 
    });
    playersConfig.set("user-1", {
        positionRequestCallback: () => {
            return player1.getPosition();
        },
        networking: {
            inbound: {
                packetloss: 0,
                ping: 0,
                jitter: 0
            },
            outbound: {
                packetloss: 0,
                ping: 0,
                jitter: 0
            }
        }
    });
    playersConfig.set("user-2", {
        positionRequestCallback: () => {
            return player2.getPosition();
        },
        networking: {
            inbound: {
                packetloss: 0,
                ping: 0,
                jitter: 0
            },
            outbound: {
                packetloss: $packetLossPercent / 100,
                ping: $pingMs,
                jitter: $jitterMs
            }
        }
    });



    let config: NetworkerOptions = {
        tickRate: $tickRate,
        components: {
            server: {},
            players: playersConfig
        }
    }

    let networker = new Networker(config);
    networker.start();

    let networkedPlayer = new NetworkedPlayer({
        networker,
        playerId: "user-2",
        perspectivePlayerId: "user-1", // TODO: Why can I not swap these?
        smoothing: {
            type: SmoothingType.SMOOTHED,
            extrapolate: false
        },
        defaultPosition: {
            x: 0,
            y: 0
        }
    });

    function changeTickRate(newTickRate: number): void {
        config.tickRate = newTickRate;
        networker.changeOptions(config);
    }
    function changePing(newPingMs: number): void {
        config.components.players.get("user-2")!.networking.outbound.ping = newPingMs;
    }
    function changePacketLoss(newPacketLossPercent: number): void {
        config.components.players.get("user-2")!.networking.outbound.packetloss = newPacketLossPercent / 100;
    }
    function changeJitter(newJitterMs: number): void {
        config.components.players.get("user-2")!.networking.outbound.jitter = newJitterMs;
    }
    function changeExtrapolate(newValue: boolean): void {
        networkedPlayer.stop();
        networkedPlayer = new NetworkedPlayer({
            networker,
            playerId: "user-2",
            perspectivePlayerId: "user-1", // TODO: Why can I not swap these?
            smoothing: {
                type: SmoothingType.SMOOTHED,
                extrapolate: newValue 
            },
            defaultPosition: {
                x: 0,
                y: 0
            }
        });
    }
    
    tickRate.subscribe(changeTickRate);
    pingMs.subscribe(changePing);
    packetLossPercent.subscribe(changePacketLoss);
    jitterMs.subscribe(changeJitter);
    extrapolate.subscribe(changeExtrapolate);

    onDestroy(() => {
        networker.stop();
        networkedPlayer.stop();
    });

    // Analytics
    let tracker = new FiddleAnalyticTracker({
        visualization: "smoothing-stuttering-comparison"
    });
    tickRate.subscribe(tracker.createControlHook({input: "tick-rate"}));
    pingMs.subscribe(tracker.createControlHook({input: "ping"}));
    packetLossPercent.subscribe(tracker.createControlHook({input: "packet-loss"}));
    jitterMs.subscribe(tracker.createControlHook({input: "jitter"}));
    extrapolate.subscribe(tracker.createControlHook({input: "extrapolate"}));
</script>
<style>
    .controls {
        display: flex;
        flex-direction: column;
    }
    .control {
        display: flex;
        flex-direction: column;
    }
    .extrapolate-control {
        flex-direction: row;
        gap: 1rem;
    }
</style>

<section class="controls">
    <div class="tick-rate-control control">
        <label for="tick-rate-input">Tick rate: {$tickRate}</label>
        <input id="tick-rate-input" type="range" min={1} max={100} bind:value={$tickRate}>
    </div>
    <div class="ping-control control">
        <label for="ping-input">Ping: {$pingMs}ms</label>
        <input id="ping-input" type="range" min={0} max={1000} bind:value={$pingMs}>
    </div>
    <div class="packetloss-control control">
        <label for="packetloss-input">Packetloss: {$packetLossPercent}%</label>
        <input id="packetloss-input" type="range" min={0} max={100} bind:value={$packetLossPercent}>
    </div>
    <div class="jitter-control control">
        <label for="jitter-input">Jitter: {$jitterMs}ms</label>
        <input id="jitter-input" type="range" min={0} max={500} bind:value={$jitterMs}>
    </div>
    <div class="extrapolate-control control">
        <label for="extrapolate-input">Extrapolate</label>
        <input id="extrapolate-input" type="checkbox" bind:checked={$extrapolate}>
    </div>
</section>
<PerspectiveVisualizer player1={player1} player2={networkedPlayer} />

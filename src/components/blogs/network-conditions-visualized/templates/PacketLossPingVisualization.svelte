<script lang="ts">
    import { BotPlayer } from "../networker/players/bot";
    import { NetworkedPlayer, SmoothingType } from "../networker/players/networked";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import GameBoard from "../GameBoard.svelte";
    import { PATH } from "../paths/basic-square";
    import { writable } from "svelte/store";
    import { FiddleAnalyticTracker } from "../fiddle-analytic";

    let tickRate = writable<number>(10);
    let E2ELatencyMs = writable<number>(100);
    let packetLossPercent = writable<number>(5);
    
    let playersConfig = new Map<string, NetworkerPlayer>();
    let player1 = new BotPlayer({
        movementSpeed: 1,
        tickSpeed: 1,
        actions: PATH,
        rendering: {
            color: "red"
        }
    });
    let player2 = new BotPlayer({
        movementSpeed: 1,
        tickSpeed: 1,
        actions: PATH,
        rendering: {
            color: "transparent"
        }
    });
    playersConfig.set("user-1", {
        positionRequestCallback: () => {
            return player1.getPosition();
        },
        networking: {
            inbound: {
                packetloss: 0,
                latency: 0,
                jitter: 0
            },
            outbound: {
                packetloss: 0,
                latency: 0,
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
                latency: 0,
                jitter: 0
            },
            outbound: {
                packetloss: $packetLossPercent / 100,
                latency: $E2ELatencyMs,
                jitter: 0
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
            type: SmoothingType.NONE
        },
        defaultPosition: {
            x: 0,
            y: 0
        },
        rendering: {
            color: "blue"
        }
    });

    function changeTickRate(newTickRate: number) {
        config.tickRate = newTickRate;
        networker.changeOptions(config);
    }
    function changePing(newPingMs: number) {
        config.components.players.get("user-2")!.networking.outbound.latency = newPingMs;
    }
    function changePacketLoss(newPacketLossPercent: number) {
        config.components.players.get("user-2")!.networking.outbound.packetloss = newPacketLossPercent / 100;
    }
    
    tickRate.subscribe(changeTickRate);
    E2ELatencyMs.subscribe(changePing);
    packetLossPercent.subscribe(changePacketLoss);

    // Analytics
    let tracker = new FiddleAnalyticTracker({
        visualization: "packetloss-latency"
    });
    tickRate.subscribe(tracker.createControlHook({input: "tick-rate"}));
    E2ELatencyMs.subscribe(tracker.createControlHook({input: "e2e-latency"}));
    packetLossPercent.subscribe(tracker.createControlHook({input: "packet-loss"}));
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
</style>

<section class="controls">
    <div class="tick-rate-control control">
        <label for="tick-rate-input">Tick rate: {$tickRate}</label>
        <input id="tick-rate-input" type="range" min={1} max={100} bind:value={$tickRate}>
    </div>
    <div class="e2e-latency-control control">
        <label for="latency-input">E2E Latency: {$E2ELatencyMs}ms</label>
        <input id="latency-input" type="range" min={0} max={1000} bind:value={$E2ELatencyMs}>
    </div>
    <div class="packetloss-control control">
        <label for="packetloss-input">Packetloss: {$packetLossPercent}%</label>
        <input id="packetloss-input" type="range" min={0} max={100} bind:value={$packetLossPercent}>
    </div>
</section>
<GameBoard players={[player1, networkedPlayer]} />

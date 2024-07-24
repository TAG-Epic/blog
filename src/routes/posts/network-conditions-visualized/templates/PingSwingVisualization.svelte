<script lang="ts">
    import { BotPlayer } from "../networker/players/bot";
    import { NetworkedPlayer, SmoothingType } from "../networker/players/networked";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import GameBoard from "../GameBoard.svelte";
    import { PATH } from "../paths/ping-swing";
    import { writable } from "svelte/store";
    import { onDestroy } from "svelte";
    import { FiddleAnalyticTracker } from "../fiddle-analytic";
    import { ShapeType } from "../shapes";

    let tickRate = writable<number>(10);
    let E2ELatencyMs = writable<number>(100);
    let packetLossPercent = writable<number>(5);
    let jitterMs = writable<number>(20);
    let extrapolate = writable<boolean>(false);
    
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

    let smoothedNetworkedPlayer = new NetworkedPlayer({
        networker,
        playerId: "user-2",
        perspectivePlayerId: "user-1", // TODO: Why can I not swap these?
        smoothing: {
            type: SmoothingType.SMOOTHED,
            extrapolate: $extrapolate
        },
        defaultPosition: {
            x: 0,
            y: 0
        },
        rendering: {
            color: "blue"
        }
    });
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
            color: "green"
        }
    });

    function changeTickRate(newTickRate: number): void {
        config.tickRate = newTickRate;
        networker.changeOptions(config);
    }
    function changePing(newPingMs: number): void {
        config.components.players.get("user-2")!.networking.outbound.latency = newPingMs;
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
            },
            rendering: {
                color: "blue"
            }
        });
    }
    
    tickRate.subscribe(changeTickRate);
    E2ELatencyMs.subscribe(changePing);
    packetLossPercent.subscribe(changePacketLoss);
    jitterMs.subscribe(changeJitter);
    extrapolate.subscribe(changeExtrapolate);

    onDestroy(() => {
        networker.stop();
        networkedPlayer.stop();
    });

    // Analytics
    let tracker = new FiddleAnalyticTracker({
        visualization: "ping-swing"
    });
    tickRate.subscribe(tracker.createControlHook({input: "tick-rate"}));
    E2ELatencyMs.subscribe(tracker.createControlHook({input: "e2e-latency"}));
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
    <div class="e2e-latency-control control">
        <label for="latency-input">E2E Latency: {$E2ELatencyMs}ms</label>
        <input id="latency-input" type="range" min={0} max={1000} bind:value={$E2ELatencyMs}>
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
<GameBoard canvas_size={250} players={[player1, networkedPlayer, smoothedNetworkedPlayer]} staticShapes={[
    {
        type: ShapeType.RECTANGLE,
        x: 65,
        y: 110,
        width: 50,
        height: 2,
        color: "black"
    },
    {
        type: ShapeType.RECTANGLE,
        x: 200,
        y: 110,
        width: 50,
        height: 2,
        color: "black"
    }
]}/>

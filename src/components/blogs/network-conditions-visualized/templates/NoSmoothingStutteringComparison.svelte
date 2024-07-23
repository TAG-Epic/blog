<script lang="ts">
    import { BotPlayer } from "../networker/players/bot";
    import { NetworkedPlayer, SmoothingType } from "../networker/players/networked";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import PerspectiveVisualizer from "../PerspectiveVisualizer.svelte";
    import { writable } from "svelte/store";
    import { PATH } from "../paths/basic-square";
    import { FiddleAnalyticTracker } from "../fiddle-analytic";
    
    let playersConfig = new Map<string, NetworkerPlayer>();
    let player1 = new BotPlayer({
        movementSpeed: 1,
        tickSpeed: 1,
        actions: PATH 
    });
    let player2 = new BotPlayer({
        movementSpeed: 1,
        tickSpeed: 1,
        actions: PATH,
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
                packetloss: 0,
                ping: 0,
                jitter: 0
            }
        }
    });


    let tickRate = writable<number>(2);

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
        }
    });

    function changeTickRate(newTickRate: number) {
        config.tickRate = newTickRate;
        networker.changeOptions(config);
    }
    tickRate.subscribe(changeTickRate);
    
    // Analytics
    // Analytics
    let tracker = new FiddleAnalyticTracker({
        visualization: "no-smoothing-stuttering-comparison"
    });
    tickRate.subscribe(tracker.createControlHook({input: "tick-rate"}));
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
</section>
<PerspectiveVisualizer player1={player1} player2={networkedPlayer} />

<script lang="ts">
    import { BotPlayer } from "../networker/players/bot";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import NetworkLogs from "../NetworkLogs.svelte";
    import { NetworkerEventType } from "../networker/events";
    import { writable } from "svelte/store";
    import { PATH } from "../paths/basic-square";
    import { FiddleAnalyticTracker } from "../fiddle-analytic";
    
    let playersConfig = new Map<string, NetworkerPlayer>();
    let player1 = new BotPlayer({
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

    let config: NetworkerOptions = {
        tickRate: 2,
        components: {
            server: {},
            players: playersConfig
        }
    }

    let networker = new Networker(config);
    networker.start();

    function changeTickRate(newTickRate: number) {
        config.tickRate = newTickRate;
        networker.changeOptions(config);
    }

    let tickRate = writable<number>(2);
    tickRate.subscribe(changeTickRate);
    
    // Analytics
    let tracker = new FiddleAnalyticTracker({
        visualization: "send-network-logs"
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
<NetworkLogs networker={networker} showEvents={[NetworkerEventType.PLAYER_SENT_PACKET]}/>

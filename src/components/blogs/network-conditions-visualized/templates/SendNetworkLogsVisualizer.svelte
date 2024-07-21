<script lang="ts">
    import { WaypointPlayer } from "../networker/players/waypoint";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import NetworkLogs from "../NetworkLogs.svelte";
    import { NetworkerEventType } from "../networker/events";
    import { writable } from "svelte/store";
    
    let playersConfig = new Map<string, NetworkerPlayer>();
    let player1 = new WaypointPlayer({
        movementSpeed: 1,
        waypoints: [
            {
                x: 10,
                y: 10
            },
            {
                x: 50,
                y: 10
            },
            {
                x: 50,
                y: 50
            },
            {
                x: 10,
                y: 50
            }
        ]
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
    let hasFiddled = false;
    
    function onFiddle(): void {
        if (!hasFiddled) {
            hasFiddled = true;
            window.plausible("network conditions visualized: fiddle", {
                props: {
                    visualization: "network-logs"
                }
            });
        }
    }
    tickRate.subscribe(onFiddle);
</script>

<label for="tick-rate-input">Tick rate: {$tickRate}</label>
<br/>
<input id="tick-rate-input" type="range" min={1} max={100} bind:value={$tickRate}>
<br/>
<NetworkLogs networker={networker} showEvents={[NetworkerEventType.PLAYER_SENT_PACKET]}/>

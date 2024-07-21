<script lang="ts">
    import { WaypointPlayer } from "../networker/players/waypoint";
    import { NetworkedPlayer, SmoothingType } from "../networker/players/networked";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import PerspectiveVisualizer from "../PerspectiveVisualizer.svelte";
    import BASIC_WAYPOINT_PATH from "./basic-waypoint-path.json";
    import { writable } from "svelte/store";
    
    let playersConfig = new Map<string, NetworkerPlayer>();
    let player1 = new WaypointPlayer({
        movementSpeed: 1,
        waypoints: BASIC_WAYPOINT_PATH
    });
    let player2 = new WaypointPlayer({
        movementSpeed: 1,
        waypoints: BASIC_WAYPOINT_PATH
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
    let hasFiddled = false;
    
    function onFiddle(): void {
        if (!hasFiddled) {
            hasFiddled = true;
            window.plausible("network conditions visualized: fiddle", {
                props: {
                    visualization: "movement-no-smoothing"
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
<PerspectiveVisualizer player1={player1} player2={networkedPlayer} />

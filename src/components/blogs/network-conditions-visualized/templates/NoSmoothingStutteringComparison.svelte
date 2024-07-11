<script lang="ts">
    import { WaypointPlayer } from "../networker/players/waypoint";
    import { NetworkedPlayer, SmoothingType } from "../networker/players/networked";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import PerspectiveVisualizer from "../PerspectiveVisualizer.svelte";
    import BASIC_WAYPOINT_PATH from "./basic-waypoint-path.json";
    
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


    let config: NetworkerOptions = {
        tickRate: 2,
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

    let tickRate = 2;
    $: changeTickRate(tickRate);
</script>

<label for="tick-rate-input">Tick rate: {tickRate}</label>
<br/>
<input id="tick-rate-input" type="range" min={1} max={100} bind:value={tickRate}>
<br/>
<table>
    <tr>
        <th>Local perspective</th>
        <th>Other player perspective</th>
    </tr>
    <tr>
        <td class="perspective-container">
            <PerspectiveVisualizer player={player2} />
        </td>
        <td class="perspective-container">
            <PerspectiveVisualizer player={networkedPlayer} />
        </td>
    </tr>
</table>

<style>
    .perspective-container {
        height: 5rem;
    }
</style>

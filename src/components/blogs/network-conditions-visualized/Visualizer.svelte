<script lang="ts">
    import { WaypointPlayer } from "./networker/players/waypoint";
    import { Networker } from "./networker";
    import type { NetworkerOptions, NetworkerPlayer } from "./networker";
    import NetworkLogs from "./NetworkLogs.svelte";
    
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
    let player2 = new WaypointPlayer({
        movementSpeed: 2,
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
                packetloss: .5,
                ping: 5,
                jitter: 5
            },
            outbound: {
                packetloss: .5,
                ping: 5,
                jitter: 5
            }
        }
    });
    playersConfig.set("user-2", {
        positionRequestCallback: () => {
            return player2.getPosition();
        },
        networking: {
            inbound: {
                packetloss: .5,
                ping: 5,
                jitter: 5
            },
            outbound: {
                packetloss: .5,
                ping: 5,
                jitter: 5
            }
        }
    });

    let config: NetworkerOptions = {
        tickRate: 5,
        components: {
            server: {},
            players: playersConfig
        }
    }

    let networker = new Networker(config);
    networker.start();
</script>

<NetworkLogs networker={networker} />

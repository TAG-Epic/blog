<script lang="ts">
    import { WaypointPlayer } from "../networker/players/waypoint";
    import { NetworkedPlayer, SmoothingType } from "../networker/players/networked";
    import { Networker } from "../networker";
    import type { NetworkerOptions, NetworkerPlayer } from "../networker";
    import PerspectiveVisualizer from "../PerspectiveVisualizer.svelte";
    import BASIC_WAYPOINT_PATH from "./basic-waypoint-path.json";
    import { writable } from "svelte/store";

    let tickRate = writable<number>(10);
    let pingMs = writable<number>(100);
    let packetLossPercent = writable<number>(5);
    
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
                packetloss: $packetLossPercent / 100,
                ping: $pingMs,
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
        }
    });

    function changeTickRate(newTickRate: number) {
        config.tickRate = newTickRate;
        networker.changeOptions(config);
    }
    function changePing(newPingMs: number) {
        config.components.players.get("user-2")!.networking.outbound.ping = newPingMs;
    }
    function changePacketLoss(newPacketLossPercent: number) {
        config.components.players.get("user-2")!.networking.outbound.packetloss = newPacketLossPercent / 100;
    }
    
    tickRate.subscribe(changeTickRate);
    pingMs.subscribe(changePing);
    packetLossPercent.subscribe(changePacketLoss);

    // Analytics
    let hasFiddled = false;
    
    function onFiddle(): void {
        if (!hasFiddled) {
            hasFiddled = true;
            window.plausible("network conditions visualized: fiddle", {
                props: {
                    visualization: "packet-loss-ping"
                }
            });
        }
    }
    tickRate.subscribe(onFiddle);
    pingMs.subscribe(onFiddle);
    packetLossPercent.subscribe(onFiddle);
</script>

<label for="tick-rate-input">Tick rate: {$tickRate}</label>
<br/>
<input id="tick-rate-input" type="range" min={1} max={100} bind:value={$tickRate}>
<br/>
<label for="ping-input">Ping: {$pingMs}ms</label>
<br/>
<input id="ping-input" type="range" min={0} max={1000} bind:value={$pingMs}>
<br/>
<label for="packetloss-input">Packetloss: {$packetLossPercent}%</label>
<br/>
<input id="packetloss-input" type="range" min={0} max={100} bind:value={$packetLossPercent}>
<PerspectiveVisualizer player1={player1} player2={networkedPlayer} />

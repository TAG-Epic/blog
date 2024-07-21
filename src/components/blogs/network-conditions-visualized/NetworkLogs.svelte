<script lang="ts">
    import type { Networker } from "./networker";
    import type { NetworkerEvent, PlayerSentPacketEvent, PlayerReceivedPacketEvent } from "./networker/events";
    import { NetworkerEventType } from "./networker/events";
    import { getEnumValues } from "./networker/misc";

    export let networker: Networker;
    export let maxLogLines: number = 10;
    export let showEvents: NetworkerEventType[] = getEnumValues(NetworkerEventType);


    let logs: NetworkerEvent[] = [];

    networker.addListener((event: NetworkerEvent) => {
        if (!showEvents.includes(event.type)) {
            return;
        }
        let newLogs = logs.concat(event);

        if (newLogs.length > maxLogLines) {
            newLogs.shift();
        }
        logs = newLogs;
    });

    function isEventDropped(event: NetworkerEvent): boolean | undefined {
        if (event.type === NetworkerEventType.PLAYER_SENT_PACKET) {
            return (event as PlayerSentPacketEvent).dropped;
        }
        if (event.type === NetworkerEventType.PLAYER_RECEIVED_PACKET) {
            return (event as PlayerReceivedPacketEvent).dropped;
        }
    }
</script>

<span>Network logs (LIVE)</span>
<div class="logs-container" aria-hidden={true}>
    {#each logs as logLine}
        {@const dropped = isEventDropped(logLine)}
        <div class="log-line" data-event-type={logLine.type} data-dropped={dropped}>
            {#if logLine.type === NetworkerEventType.PLAYER_SENT_PACKET}
                <span class="player-reference">{logLine.senderPlayerId}</span> <span>sent packet {logLine.id} with position {JSON.stringify(logLine.data)} to server</span>
            {/if}
            {#if logLine.type === NetworkerEventType.SERVER_RECEIVED_PACKET}
                <span>server received packet {logLine.id} from</span> <span class="player-reference">{logLine.senderPlayerId}</span> <span>after {logLine.ping.toFixed(0)}ms</span>
            {/if}
            {#if logLine.type === NetworkerEventType.PLAYER_RECEIVED_PACKET}
                <span class="player-reference">{logLine.receiverPlayerId}</span> <span>received packet {logLine.id} from the server with</span> <span>{logLine.senderPlayerId}</span><span>'s position after {logLine.ping.toFixed(0)}ms</span>
            {/if}
            {#if dropped}
                <span> (dropped)</span>
            {/if}
        </div>
    {/each}
</div>

<style>
    .logs-container {
        border: 1px solid #121212;
        padding: .2rem;
        height: 26ch;
    }
</style>

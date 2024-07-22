import type { NetworkerEvent, PlayerSentPacketEvent, ServerReceivedPacketEvent, PlayerReceivedPacketEvent } from "./events";
import { NetworkerEventType } from "./events";
import type { Position } from "./misc";
export type NetworkerOptions = {
    components: {
        server: {},
        players: Map<string, NetworkerPlayer>
    };
    tickRate: number;
};
export type PositionRequestCallback = () => Position;
export type NetworkerPlayer = {
    positionRequestCallback: PositionRequestCallback;
    networking: {
        inbound: {
            ping: number;
            packetloss: number;
            jitter: number;
        };
        outbound: {
            ping: number;
            packetloss: number;
            jitter: number;
        }
    };
};

type NetworkerListener = (event: NetworkerEvent) => void;
type IntervalTimer = ReturnType<typeof setInterval>;
type TimeoutTimer = ReturnType<typeof setInterval>;

export class Networker {
    #options: NetworkerOptions;
    #listeners: NetworkerListener[];
    #intervals: IntervalTimer[];
    #timeouts: TimeoutTimer[];
    #nextId: number;

    constructor(options: NetworkerOptions) {
       this.#options = options; 
       this.#listeners = [(event) => {this.#handleEvent(event)}];
       this.#intervals = [];
       this.#timeouts = [];
       this.#nextId = 0;
    }

    addListener(listener: NetworkerListener): void {
        this.#listeners.push(listener);
    }
    removeListener(toRemove: NetworkerListener): void {
        console.log(this.#listeners);
        this.#listeners = this.#listeners.filter(listener => listener !== toRemove);
        console.log(this.#listeners);
    }
    #dispatch(event: NetworkerEvent) {
        for (const listener of this.#listeners) {
            listener(event);
        }
    }
    start(): void {
        for (const playerId of this.#options.components.players.keys()) {
            let tickEveryMs = 1000 / this.#options.tickRate;
            let intervalId = setInterval(() => {this.#pollPlayer(playerId)}, tickEveryMs);
            this.#intervals.push(intervalId);
        }
    }
    stop(): void {
        for (const intervalId of this.#intervals) {
            clearInterval(intervalId);
        }
        for (const timeoutId of this.#timeouts) {
            clearTimeout(timeoutId);
        }
        this.#intervals = [];
        this.#timeouts = [];
    }
    changeOptions(newOptions: NetworkerOptions): void {
        this.stop();
        this.#options = newOptions;
        this.start();
    }

    #pollPlayer(playerId: string) {
        let playerData = this.#options.components.players.get(playerId);

        if (playerData === undefined) {
            throw "was requested to poll player where the player was not in the options";
        }

        let position = playerData.positionRequestCallback();
        let packetId = this.#nextId;
        this.#nextId += 1;
        
        let dropped = Math.random() < playerData.networking.outbound.packetloss;

        let event: PlayerSentPacketEvent = {
            type: NetworkerEventType.PLAYER_SENT_PACKET,
            id: packetId,
            dropped,
            data: position,
            senderPlayerId: playerId,
        };

        this.#dispatch(event);
    }
    #handleEvent(event: NetworkerEvent): void {
        if (event.type === NetworkerEventType.PLAYER_SENT_PACKET) {
            this.#handlePlayerSentPacketEvent(event as PlayerSentPacketEvent);
        }
        if (event.type === NetworkerEventType.SERVER_RECEIVED_PACKET) {
            this.#handleServerReceivedPacketEvent(event as ServerReceivedPacketEvent);
        }
    }

    #handlePlayerSentPacketEvent(event: PlayerSentPacketEvent): void {
        if (event.dropped) {
            return;
        }
        let playerData = this.#options.components.players.get(event.senderPlayerId);
        
        if (playerData === undefined) {
            throw "event was received with no player data in config";
        }

        let jitter = playerData.networking.outbound.jitter * Math.random();
        let ping = playerData.networking.outbound.ping + jitter;

        let serverReceivedEvent: ServerReceivedPacketEvent = {
            type: NetworkerEventType.SERVER_RECEIVED_PACKET,
            id: event.id,
            data: event.data,
            senderPlayerId: event.senderPlayerId,
            ping
        };
        this.#safeTimeout(() => {this.#dispatch(serverReceivedEvent)}, ping);
    }
    #handleServerReceivedPacketEvent(event: ServerReceivedPacketEvent) {
        for (const [playerId, playerData] of this.#options.components.players) {
            if (playerId === event.senderPlayerId) {
                return;
            }
            let dropped = Math.random() < playerData.networking.inbound.packetloss;

            let jitter = playerData.networking.inbound.jitter * Math.random();
            let ping = playerData.networking.inbound.ping + jitter;

            if (dropped) {
                ping = 0;
            }
            
            let receiveEvent: PlayerReceivedPacketEvent = {
                type: NetworkerEventType.PLAYER_RECEIVED_PACKET,
                id: event.id,
                dropped,
                data: event.data,
                ping,
                senderPlayerId: event.senderPlayerId,
                receiverPlayerId: playerId
            };
            
            this.#safeTimeout(() => {
                this.#dispatch(receiveEvent);
            }, ping);
        }
    }
    #safeTimeout(callback: () => void, after: number): TimeoutTimer {
        let timeoutId: TimeoutTimer | undefined;

        timeoutId = setTimeout(() => {
            callback();
            this.#timeouts = this.#timeouts.filter(timeout => timeout !== timeoutId);
        }, after);

        return timeoutId;
    }
}

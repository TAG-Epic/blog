import type { Position } from "../misc";
import { BasePlayer } from "./base";
import type { Networker } from "../";
import { NetworkerEventType, type NetworkerEvent } from "../events";


export type NetworkedPlayerSmoothingConfig = SmoothingConfigSmoothing | SmoothingConfigNoSmoothing;
export enum SmoothingType {
    NONE,
    SMOOTHED
}
export type SmoothingConfigNoSmoothing = {
    type: SmoothingType.NONE
}
export type SmoothingConfigSmoothing = {
    type: SmoothingType.SMOOTHED
};
export type NetworkedPlayerConfig = {
    networker: Networker;
    playerId: string;
    perspectivePlayerId: string;
    defaultPosition: Position;

    smoothing: NetworkedPlayerSmoothingConfig;
};

export class NetworkedPlayer extends BasePlayer {
    #config: NetworkedPlayerConfig;
    #lastReceivedPosition: Position;
    #lastReceivedPacketId: number;

    constructor(config: NetworkedPlayerConfig) {
        super();

        this.#config = config;
        this.#lastReceivedPosition = this.#config.defaultPosition;
        this.#lastReceivedPacketId = -1;

        this.#config.networker.addListener((event) => {this.handleEvent(event)});
    }
    getPosition(): Position {
        if (this.#config.smoothing.type === SmoothingType.NONE) {
            return this.#lastReceivedPosition;
        }

        throw "Unsupported smoothing type";
    }

    handleEvent(event: NetworkerEvent): void {
        if (event.type !== NetworkerEventType.PLAYER_RECEIVED_PACKET) return;
        if (event.senderPlayerId !== this.#config.playerId) return;
        if (event.receiverPlayerId !== this.#config.perspectivePlayerId) return;

        if (event.id < this.#lastReceivedPacketId) return;
        this.#lastReceivedPacketId = event.id;
        
        this.#lastReceivedPosition = event.data;
    }
}

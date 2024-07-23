import type { Position } from "../misc";
import { BasePlayer } from "./base";
import type { Networker } from "../";
import { NetworkerEventType, type NetworkerEvent } from "../events";
import type { PlayerRenderConfig } from "./base";


export type NetworkedPlayerSmoothingConfig = SmoothingConfigSmoothing | SmoothingConfigNoSmoothing;
export enum SmoothingType {
    NONE,
    SMOOTHED
}
export type SmoothingConfigNoSmoothing = {
    type: SmoothingType.NONE
}
export type SmoothingConfigSmoothing = {
    type: SmoothingType.SMOOTHED,
    extrapolate: boolean
};
export type NetworkedPlayerConfig = {
    networker: Networker;
    playerId: string;
    perspectivePlayerId: string;
    defaultPosition: Position;
    smoothing: NetworkedPlayerSmoothingConfig;
    rendering: PlayerRenderConfig;
};
type PositionInfo = {
    last: {
        receivedAt: number,
        position: Position
    },
    second: {
        receivedAt: number,
        position: Position
    }
};

export class NetworkedPlayer extends BasePlayer {
    #config: NetworkedPlayerConfig;
    #positionInfo: PositionInfo;
    #lastReceivedPacketId: number;
    #eventHandler: (event: NetworkerEvent) => void;

    constructor(config: NetworkedPlayerConfig) {
        super();

        let currentTime = Date.now();

        this.#config = config;
        this.#positionInfo = {
            second: {
                receivedAt: currentTime,
                position: this.#config.defaultPosition
            },
            last: {
                receivedAt: currentTime,
                position: this.#config.defaultPosition
            }
        };
        this.#lastReceivedPacketId = -1;

        this.#eventHandler = (event: NetworkerEvent) => {
            this.handleEvent(event);
        }

        this.#config.networker.addListener(this.#eventHandler);
    }
    getPosition(): Position {
        if (this.#config.smoothing.type === SmoothingType.NONE) {
            return this.#positionInfo.last.position;
        }
        if (this.#config.smoothing.type === SmoothingType.SMOOTHED) {
            let timeBetween = this.#positionInfo.last.receivedAt - this.#positionInfo.second.receivedAt;

            // Fixes 0 division error
            if (timeBetween === 0) {
                return this.#positionInfo.second.position;
            }

            let offsetStart = this.#positionInfo.second.receivedAt + timeBetween;

            let currentTime = Date.now();

            let currentRelativeToStart = currentTime - offsetStart;
            let progressFraction = currentRelativeToStart / timeBetween;
                
            if (progressFraction > 1 && !this.#config.smoothing.extrapolate) {
                return this.#positionInfo.last.position;
            }
            let lastPosition = this.#positionInfo.second.position;
            let newPosition = this.#positionInfo.last.position;

            return {
                x: lastPosition.x + ((newPosition.x - lastPosition.x) * progressFraction),
                y: lastPosition.y + ((newPosition.y - lastPosition.y) * progressFraction)
            };
        }

        throw "Unsupported smoothing type";
    }

    handleEvent(event: NetworkerEvent): void {
        if (event.type !== NetworkerEventType.PLAYER_RECEIVED_PACKET) return;
        if (event.senderPlayerId !== this.#config.playerId) return;
        if (event.receiverPlayerId !== this.#config.perspectivePlayerId) return;

        if (event.id < this.#lastReceivedPacketId) return;
        this.#lastReceivedPacketId = event.id;
        
        this.#positionInfo.second = this.#positionInfo.last;
        this.#positionInfo.last = {
            position: event.data,
            receivedAt: Date.now()
        };
    }
    stop(): void {
        this.#config.networker.removeListener(this.#eventHandler);
    }
    getRenderConfig(): PlayerRenderConfig {
        return this.#config.rendering;
    }
}

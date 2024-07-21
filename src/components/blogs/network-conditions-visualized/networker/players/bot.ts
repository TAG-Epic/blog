import type { Position } from "../misc";
import { BasePlayer } from "./base";

export enum BotActionType {
    WAYPOINT,
    PAUSE
};
export type BotAction = BotWaypointAction | BotPauseAction;

export type BotWaypointAction = {
    type: BotActionType.WAYPOINT,
    newPosition: Position
};
export type BotPauseAction = {
    type: BotActionType.PAUSE,
    ticks: number;
};

export type BotPlayerOptions = {
    actions: BotAction[],
    movementSpeed: number;
    tickSpeed: number;
};

export class BotPlayer extends BasePlayer {
    #config: BotPlayerOptions;
    #startTime: number;

    constructor(config: BotPlayerOptions) {
        super();

        this.#config = config;
        this.#startTime = Date.now();
    }

    getPosition(): Position {
        const currentTime = Date.now();
        const timeSinceStart = currentTime - this.#startTime;
        const tickId = Math.floor(timeSinceStart);
        const roundTicks = this.#getRoundTicks();
        let ticksLeftInRound = tickId % roundTicks;

        let lastPosition = this.#getDefaultPosition();

        for (let i = 0; i < this.#config.actions.length; i++) {
            let action = this.#config.actions[i];

            if (action.type == BotActionType.PAUSE) {
                if (action.ticks >= ticksLeftInRound) {
                    return lastPosition;
                }
            }
            if (action.type === BotActionType.WAYPOINT) {
                let newPosition = action.newPosition;

                let distanceToNewPosition = this.#getDistanceBetweenPoints(lastPosition, newPosition);
                let ticksToNewPosition = Math.floor(distanceToNewPosition / this.#config.movementSpeed);

                if (ticksLeftInRound <= ticksToNewPosition) {
                    const ratio = ticksLeftInRound / ticksToNewPosition;
                    const interpolatedPosition: Position = {
                        x: lastPosition.x + (newPosition.x - lastPosition.x) * ratio,
                        y: lastPosition.y + (newPosition.y - lastPosition.y) * ratio
                    };
                    return interpolatedPosition;

                }
                ticksLeftInRound -= ticksToNewPosition;
                lastPosition = newPosition;

            }
            
        }
        return lastPosition;
    }

    #getRoundTicks(): number {
        let ticks = 0;

        let previousPosition: Position | null = null;

        for (let i = 0; i < this.#config.actions.length; i++) {
            let action = this.#config.actions[i];

            if (action.type === BotActionType.WAYPOINT) {
                if (previousPosition === null) {
                    previousPosition = action.newPosition;
                } else {
                    ticks += Math.floor(this.#getDistanceBetweenPoints(previousPosition, action.newPosition) / this.#config.movementSpeed);
                    previousPosition = action.newPosition;

                }
            }
            if (action.type === BotActionType.PAUSE) {
                ticks += action.ticks;
            }
        }

        return ticks;
    }
    #getDefaultPosition(): Position {
        for (const action of this.#config.actions) {
            if (action.type === BotActionType.WAYPOINT) {
                return action.newPosition;
            }
        }
        console.warn("No position was set in waypoint path, defaulting to 0 0 as position");
        return {
            x: 0,
            y: 0
        };
    }

    #getDistanceBetweenPoints(point1: Position, point2: Position): number {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }
}


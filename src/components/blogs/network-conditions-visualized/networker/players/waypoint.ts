import type { Position } from "../misc";
import { BasePlayer } from "./base";

export type WaypointPlayerOptions = {
    waypoints: Position[],
    movementSpeed: number
};

export class WaypointPlayer extends BasePlayer {
    #config: WaypointPlayerOptions;
    #startTime: number;

    constructor(config: WaypointPlayerOptions) {
        super();

        this.#config = config;
        this.#startTime = Date.now();

        if (this.#config.waypoints.length < 2) {
            throw "nu uh >:(";
        }
    }

    getPosition(): Position {
        const currentTime = Date.now();
        const timeSinceStart = currentTime - this.#startTime;
        const movedDistance = Math.floor(timeSinceStart * this.#config.movementSpeed);
        const roundDistance = this.#getWaypointRoundDistance();
        let distanceRemainder = movedDistance % roundDistance;

        let lastPoint = this.#config.waypoints[0];

        for (let i = 1; i < this.#config.waypoints.length; i++) {
            const point = this.#config.waypoints[i];
            const distanceToPoint = this.#getDistanceBetweenPoints(lastPoint, point);

            if (distanceRemainder <= distanceToPoint) {
                // Interpolate position between lastPoint and point based on distanceRemainder
                const ratio = distanceRemainder / distanceToPoint;
                const interpolatedPosition: Position = {
                    x: lastPoint.x + (point.x - lastPoint.x) * ratio,
                    y: lastPoint.y + (point.y - lastPoint.y) * ratio
                };
                return interpolatedPosition;
            }

            distanceRemainder -= distanceToPoint;
            lastPoint = point;
        }

        return this.#config.waypoints[this.#config.waypoints.length - 1];
    }

    #getWaypointRoundDistance(): number {
        let distance = 0;
        let previousPoint = this.#config.waypoints[0];

        for (let i = 1; i < this.#config.waypoints.length; i++) {
            const point = this.#config.waypoints[i];
            distance += this.#getDistanceBetweenPoints(previousPoint, point);
            previousPoint = point;
        }

        return distance;
    }

    #getDistanceBetweenPoints(point1: Position, point2: Position): number {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }
}


import type { Position } from "../misc";

export abstract class BasePlayer {
    abstract getPosition(): Position;
}

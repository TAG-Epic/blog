import type { Position } from "../misc";

export type PlayerRenderConfig = {
    color: string;
};

export abstract class BasePlayer {
    abstract getPosition(): Position;
    abstract getRenderConfig(): PlayerRenderConfig;
}

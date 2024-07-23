import { BotActionType } from "../networker/players/bot";
import type { BotAction } from "../networker/players/bot";
export const PATH: BotAction[] = [
    {
        type: BotActionType.WAYPOINT,
        newPosition: {
            "x": 100,
            "y": 100
        }
    },
    {
        type: BotActionType.WAYPOINT,
        newPosition: {
            "x": 220,
            "y": 100
        }
    },
    {
        type: BotActionType.PAUSE,
        ticks: 500
    },
    {
        type: BotActionType.WAYPOINT,
        newPosition: {
            "x": 100,
            "y": 100
        }
    },
    {
        type: BotActionType.PAUSE,
        ticks: 1000
    }
];

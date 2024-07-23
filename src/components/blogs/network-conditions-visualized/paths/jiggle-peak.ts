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
            "x": 150,
            "y": 100
        }
    },
    {
        type: BotActionType.PAUSE,
        ticks: 10
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

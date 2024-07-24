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
            "x": 500,
            "y": 100
        }
    },
    {
        type: BotActionType.WAYPOINT,
        newPosition: {
            "x": 500,
            "y": 500
        }
    },
    {
        type: BotActionType.WAYPOINT,
        newPosition: {
            "x": 100,
            "y": 500
        }
    },
    {
        type: BotActionType.WAYPOINT,
        newPosition: {
            "x": 100,
            "y": 100
        }
    },
];

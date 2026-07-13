"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = void 0;
exports.CONSTANTS = {
    COMMAND_PREFIX: '!',
    POLLING_INTERVALS: {
        MAP_MARKERS: 30000,
        TEAM_INFO: 30000,
        SERVER_INFO_TRACKER: 60000,
        EVENT_TRACKER: 30000,
        TEAM_TRACKER: 30000,
        DEVICE_TRACKER: 15000,
        TC_UPKEEP_TRACKER: 60000,
    },
    RECONNECT_BACKOFF: {
        INITIAL: 5000,
        MAX: 60000,
    },
    TURRET_INTERFERENCE_RADIUS: 40, // meters
    EVENT_TYPES: {
        HELI: 'heli',
        CARGO: 'cargo',
        OIL_RIG_SMALL: 'oil_rig_small',
        OIL_RIG_LARGE: 'oil_rig_large',
        CHINOOK: 'chinook',
        LOCKED_CRATE: 'locked_crate',
        DEEP_SEA: 'deep_sea',
    }
};

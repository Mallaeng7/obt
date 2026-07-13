"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alarmHandler = exports.AlarmHandler = void 0;
class AlarmHandler {
    constructor() {
        // Fcm Listener would receive the actual alarms from Firebase.
        // For now, this just hooks into any internal alarm events if emitted elsewhere.
    }
}
exports.AlarmHandler = AlarmHandler;
exports.alarmHandler = new AlarmHandler();

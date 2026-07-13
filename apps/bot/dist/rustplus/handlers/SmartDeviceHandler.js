"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartDeviceHandler = exports.SmartDeviceHandler = void 0;
class SmartDeviceHandler {
    constructor() {
        // Rustplus.js doesn't natively listen to all smart devices without subscribing.
        // It emits 'message' event for any raw protobuf message.
        // In a real scenario, we might need to parse EntityInfo from broadcast messages.
        // For now, this is a placeholder.
    }
}
exports.SmartDeviceHandler = SmartDeviceHandler;
exports.smartDeviceHandler = new SmartDeviceHandler();

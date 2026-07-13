"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.EventEmitterHub = void 0;
const events_1 = require("events");
class EventEmitterHub extends events_1.EventEmitter {
    constructor() {
        super();
        // Allow more listeners if necessary
        this.setMaxListeners(50);
    }
}
exports.EventEmitterHub = EventEmitterHub;
exports.events = new EventEmitterHub();

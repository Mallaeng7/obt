"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustPlusClient = void 0;
const rustplus_js_1 = __importDefault(require("@liamcottle/rustplus.js"));
class RustPlusClient {
    rustplus;
    serverId;
    constructor(ip, port, steamId, playerToken, serverId) {
        this.rustplus = new rustplus_js_1.default(ip, port, steamId, playerToken);
        this.serverId = serverId;
    }
    connect() {
        this.rustplus.connect();
    }
    disconnect() {
        this.rustplus.disconnect();
    }
    on(event, callback) {
        this.rustplus.on(event, callback);
    }
    sendRequestAsync(request, data) {
        return new Promise((resolve, reject) => {
            this.rustplus.sendRequestAsync({ [request]: data || {} }, (message) => {
                if (message.response?.error) {
                    reject(new Error(message.response.error.error));
                }
                else {
                    resolve(message.response);
                }
            });
        });
    }
    async getServerInfo() {
        const res = await this.sendRequestAsync('getInfo');
        return res.info;
    }
    async getTeamInfo() {
        const res = await this.sendRequestAsync('getTeamInfo');
        return res.teamInfo;
    }
    async getMapMarkers() {
        const res = await this.sendRequestAsync('getMapMarkers');
        return res.mapMarkers.markers;
    }
    async getEntityInfo(entityId) {
        const res = await this.sendRequestAsync('getEntityInfo', { entityId });
        return res.entityInfo;
    }
    async setEntityValue(entityId, value) {
        return await this.sendRequestAsync('setEntityValue', { entityId, value });
    }
    async sendTeamMessage(message) {
        return await this.sendRequestAsync('sendTeamMessage', { message });
    }
    get client() {
        return this.rustplus;
    }
    async getMap() {
        const res = await this.sendRequestAsync('getMap');
        return res.map;
    }
    async getTime() {
        const res = await this.sendRequestAsync('getTime');
        return res.time;
    }
    async promoteToLeader(steamId) {
        return await this.sendRequestAsync('promoteToLeader', { steamId });
    }
}
exports.RustPlusClient = RustPlusClient;

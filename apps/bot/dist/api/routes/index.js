"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = apiRoutes;
const servers_1 = require("./servers");
const settings_1 = require("./settings");
const devices_1 = require("./devices");
const map_1 = require("./map");
const players_1 = require("./players");
const events_1 = require("./events");
const vending_1 = require("./vending");
const plugins_1 = require("./plugins");
async function apiRoutes(fastify) {
    fastify.get('/api/health', async () => ({ status: 'ok', time: new Date() }));
    await fastify.register(servers_1.serversRoutes, { prefix: '/api/servers' });
    await fastify.register(settings_1.settingsRoutes, { prefix: '/api/settings' });
    await fastify.register(devices_1.devicesRoutes, { prefix: '/api/servers/:id/devices' });
    await fastify.register(map_1.mapRoutes, { prefix: '/api/servers/:id/map' });
    await fastify.register(players_1.playersRoutes, { prefix: '/api/servers/:id/team' });
    await fastify.register(events_1.eventsRoutes, { prefix: '/api/servers/:id/events' });
    await fastify.register(vending_1.vendingRoutes, { prefix: '/api/servers/:id/vending' });
    await fastify.register(plugins_1.pluginsRoutes, { prefix: '/api/servers/:id/plugins' });
}

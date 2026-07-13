"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuilding = exports.findItem = exports.getRecycleData = exports.getRaidCosts = exports.getBuildings = exports.getItems = void 0;
const items_json_1 = __importDefault(require("./items.json"));
const buildings_json_1 = __importDefault(require("./buildings.json"));
const raid_costs_json_1 = __importDefault(require("./raid-costs.json"));
const recycle_json_1 = __importDefault(require("./recycle.json"));
const getItems = () => items_json_1.default;
exports.getItems = getItems;
const getBuildings = () => buildings_json_1.default;
exports.getBuildings = getBuildings;
const getRaidCosts = () => raid_costs_json_1.default;
exports.getRaidCosts = getRaidCosts;
const getRecycleData = () => recycle_json_1.default;
exports.getRecycleData = getRecycleData;
const findItem = (name) => {
    return items_json_1.default.find(i => i.name.includes(name) || i.displayName.toLowerCase().includes(name.toLowerCase()));
};
exports.findItem = findItem;
const getBuilding = (name) => {
    return buildings_json_1.default.find(b => b.name.toLowerCase().includes(name.toLowerCase()));
};
exports.getBuilding = getBuilding;

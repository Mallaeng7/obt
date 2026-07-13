import items from './items.json';
import buildings from './buildings.json';
import raidCosts from './raid-costs.json';
import recycle from './recycle.json';
export const getItems = () => items;
export const getBuildings = () => buildings;
export const getRaidCosts = () => raidCosts;
export const getRecycleData = () => recycle;
export const findItem = (name) => {
    return items.find(i => i.name.includes(name) || i.displayName.toLowerCase().includes(name.toLowerCase()));
};
export const getBuilding = (name) => {
    return buildings.find(b => b.name.toLowerCase().includes(name.toLowerCase()));
};

export declare const getItems: () => {
    id: number;
    name: string;
    displayName: string;
    craftTime: number;
}[];
export declare const getBuildings: () => {
    name: string;
    hp: number;
    decayTimeHrs: number;
}[];
export declare const getRaidCosts: () => {
    "Armored Door": {
        weapon: string;
        amount: number;
        sulfur: number;
        timeSec: number;
    }[];
    "Sheet Metal Door": {
        weapon: string;
        amount: number;
        sulfur: number;
        timeSec: number;
    }[];
};
export declare const getRecycleData: () => {
    "c4.explosive": {
        itemName: string;
        amount: number;
    }[];
};
export declare const findItem: (name: string) => {
    id: number;
    name: string;
    displayName: string;
    craftTime: number;
} | undefined;
export declare const getBuilding: (name: string) => {
    name: string;
    hp: number;
    decayTimeHrs: number;
} | undefined;
//# sourceMappingURL=index.d.ts.map
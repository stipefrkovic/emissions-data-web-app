import { Record as DbRecord } from "../models/record";

export class Energy {
    energyPerCapita?: number;
    energyPerGdp?: number;

    public static fromDatabase(energy : DbRecord) : Energy {
        return {
            energyPerCapita: energy.energy_per_capita,
            energyPerGdp: energy.energy_per_gdp
        };
    }
}
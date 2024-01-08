import { Record as DbRecord } from "../models/record";

export class Energy {
    energy_per_capita?: number;
    energy_per_gdp?: number;

    public static fromDatabase(energy : DbRecord) : Energy {
        return {
            energy_per_capita: energy.energy_per_capita,
            energy_per_gdp: energy.energy_per_gdp
        };
    }
}
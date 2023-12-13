import { Energy as DbEnergy } from "models/energy";

export class Energy {
    energyPerCapita: number;
    gdpPerCapita: number;

    public static fromDatabase(energy : DbEnergy) : Energy {
        return {
            energyPerCapita: energy.energyPerCapita,
            gdpPerCapita: energy.gdpPerCapita
        };
    }
}
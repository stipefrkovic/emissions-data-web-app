import { General as DbGeneral } from "models/general";

export class General {
    id: number;
    gdp: number;
    population: number;

    public static fromDatabase(general : DbGeneral) : General {
        return {
            id: general.id,
            gdp: general.gdp,
            population: general.population
        };
    }
}

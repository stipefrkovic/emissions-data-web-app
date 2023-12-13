import { Country as DbCountry } from "models/country";

export class Country {
    name: string;
    shareOfTempChangeFromGhg: number;

    public static fromDatabase(country : DbCountry) : Country {
        return {
            name: country.name,
            shareOfTempChangeFromGhg: country.shareOfTempChangeFromGhg
        };
    }
}
import { Record as DbRecord } from "../models/record";

export class Country {
    name!: string;
    shareOfTempChangeFromGhg?: number;

    public static fromDatabase(country : DbRecord) : Country {
        return {
            name: country.country,
            shareOfTempChangeFromGhg: country.share_of_temperature_change_from_ghg
        };
    }
}
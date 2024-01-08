import { Record as DbRecord } from "../models/record";

export class Country {
    country!: string;
    share_of_temperature_change_from_ghg?: number;

    public static fromDatabase(country : DbRecord) : Country {
        return {
            country: country.country,
            share_of_temperature_change_from_ghg: country.share_of_temperature_change_from_ghg
        };
    }
}
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

// Country class for the API, includes the share_of_temperature_change_from_ghg variable
export class ApiCountry {
    @IsString() @IsNotEmpty()
    country!: string;
    @IsNumber()
    share_of_temperature_change_from_ghg?: number;

    // Creates an API model from the database model
    public static fromDatabase(country : any) : ApiCountry {
        return {
            country: country.country,
            share_of_temperature_change_from_ghg: country.total_temperature_change
        };
    }
}
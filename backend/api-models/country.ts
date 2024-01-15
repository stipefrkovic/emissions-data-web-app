import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ApiCountry {
    @IsString() @IsNotEmpty()
    country!: string;
    @IsNumber()
    share_of_temperature_change_from_ghg?: number;

    public static fromDatabase(country : any) : ApiCountry {
        return {
            country: country.country,
            share_of_temperature_change_from_ghg: country.total_temperature_change
        };
    }
}
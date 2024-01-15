import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { EnergyRecord } from "../models/energy-record";

// Energy record class for the API
export class ApiEnergyRecord {
    @IsString() @IsNotEmpty()
    country!: string;
    @IsNumber()
    energy_per_capita?: number;
    @IsNumber()
    energy_per_gdp?: number;

    // Creates an API model from the database model
    public static fromDatabase(energyRecord : EnergyRecord) : ApiEnergyRecord {
        let apiEnergyRecord : ApiEnergyRecord = {
            country: energyRecord.country,
            energy_per_capita: energyRecord.energy_per_capita,
            energy_per_gdp: energyRecord.energy_per_gdp
        };
        return apiEnergyRecord;
    }
}
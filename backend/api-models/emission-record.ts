import { IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { EmissionRecord } from "../models/emission-record";

// Emission record class for the API
export class ApiEmissionRecord {
    @IsInt() @IsNotEmpty() @Min(1900) @Max(1999)
    year!: number;
    @IsNumber()
    co2?: number;
    @IsNumber()
    methane?: number;
    @IsNumber()
    nitrous_oxide?: number;
    @IsNumber()
    total_ghg?: number;

    // Creates an API model from the database model
    public static fromDatabase(emissionRecord : EmissionRecord) : ApiEmissionRecord {
        let apiEmissionRecord : ApiEmissionRecord = {
            year: emissionRecord.year,
            co2: emissionRecord.co2,
            methane: emissionRecord.methane,
            nitrous_oxide: emissionRecord.nitrous_oxide,
            total_ghg: emissionRecord.total_ghg
        };
        return apiEmissionRecord;
    }
}
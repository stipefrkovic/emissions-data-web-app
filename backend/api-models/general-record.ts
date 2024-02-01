import { IsISO31661Alpha3, IsInt, IsNotEmpty, IsString, Max, Min, ValidateIf, isISO31661Alpha3, isNotEmpty } from "class-validator";
import { GeneralRecord } from "../models/general-record";
import { Country, isISOCode } from "../models/country";
import Container from "typedi";
import { DataSource } from "typeorm";

// Full General Record class for the API, used in the POST request
export class ApiFullGeneralRecord {
    @IsString() @IsNotEmpty()
    country!: string;
    
    @IsInt() @IsNotEmpty() @Min(1900) @Max(1999)
    year!: number;
    
    @IsInt()
    gdp?: number;
    
    @IsInt() @Min(0)
    population?: number;

    // Creates a database model from the API model
    public static async toDatabase(apiFullGeneralRecord: ApiFullGeneralRecord) : Promise<GeneralRecord> {
        let generalRecord : GeneralRecord = {
            country: apiFullGeneralRecord.country,
            year: apiFullGeneralRecord.year,
            gdp: apiFullGeneralRecord.gdp,
            population: apiFullGeneralRecord.population
        };
        if (isISOCode(apiFullGeneralRecord.country)) {
            const countryQuery = Container.get<DataSource>("database").getRepository(Country).createQueryBuilder("country");
            countryQuery.where('country.iso_code = :iso_code', {iso_code: apiFullGeneralRecord.country});
            let country = await countryQuery.getOne();
            generalRecord.country = country!.country;
        }
        return generalRecord;
    }
}

// (Reduced) General Record class for the API, used in the PUT and GET requests
export class ApiGeneralRecord {
    @IsInt()
    gdp?: number;
    
    @IsInt() @Min(0)
    population?: number;

    // Creates an API model from the database model
    public static fromDatabase(generalRecord: GeneralRecord) : ApiGeneralRecord {
        let apiGeneralRecord : ApiGeneralRecord = {
            gdp: generalRecord.gdp,
            population: generalRecord.population
        };
        return apiGeneralRecord;
    }
}

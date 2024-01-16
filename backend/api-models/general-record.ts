import { IsISO31661Alpha3, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";
import { GeneralRecord } from "../models/general-record";

// Full General Record class for the API, used in the POST request
export class ApiFullGeneralRecord {
    @IsString() @IsNotEmpty()
    country!: string;
    
    @IsInt() @IsNotEmpty() @Min(1900) @Max(1999)
    year!: number;
    
    @IsString() @IsNotEmpty() @IsISO31661Alpha3()
    iso_code!: string;
    
    @IsInt()
    gdp?: number;
    
    @IsInt() @Min(0)
    population?: number;

    // Creates a database model from the API model
    public static toDatabase(apiFullGeneralRecord: ApiFullGeneralRecord) : GeneralRecord {
        let generalRecord : GeneralRecord = {
            country: apiFullGeneralRecord.country,
            year: apiFullGeneralRecord.year,
            gdp: apiFullGeneralRecord.gdp,
            population: apiFullGeneralRecord.population
        };
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

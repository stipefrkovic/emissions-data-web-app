import { IsISO31661Alpha3, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf, isEmpty, isNotEmpty } from "class-validator";
import { GeneralRecord } from "../models/general-record";
import { EmissionRecord } from "../models/emission-record";
import { TemperatureRecord } from "../models/temperature-record";
import { EnergyRecord } from "../models/energy-record";
import { Country } from "../models/country";
import { Continent } from "../models/continent";


export class ApiFullRecord {
    @IsString() @IsNotEmpty()
    country!: string;
    @IsInt() @Min(1900) @Max(1999)
    year!: number;
    @ValidateIf((o: any) => isNotEmpty(o.iso_code)) @IsString()  @IsISO31661Alpha3()
    iso_code!: string;
    
    @IsOptional() @IsInt()
    gdp?: number;
    @IsOptional() @IsInt() @Min(0)
    population?: number;
    
    @IsOptional() @IsNumber()
    co2?: number;
    @IsOptional() @IsNumber()
    methane?: number;
    @IsOptional() @IsNumber()
    nitrous_oxide?: number;
    @IsOptional() @IsNumber()
    total_ghg?: number;
    
    @IsOptional() @IsNumber()
    share_of_temperature_change_from_ghg?: number;
    @IsOptional() @IsNumber()
    temperature_change_from_co2?: number;
    @IsOptional() @IsNumber()
    temperature_change_from_n2o?: number;
    @IsOptional() @IsNumber()
    temperature_change_from_ghg?: number;
    @IsOptional() @IsNumber()
    temperature_change_from_ch4?: number;

    @IsOptional() @IsNumber()
    energy_per_capita?: number;
    @IsOptional() @IsNumber()
    energy_per_gdp?: number;

    static variables = [
        "country",
        "year",
        "iso_code",
        "population",
        "gdp",
        "co2",
        "energy_per_capita",
        "energy_per_gdp",
        "methane",
        "nitrous_oxide",
        "share_of_temperature_change_from_ghg",
        "temperature_change_from_ch4",
        "temperature_change_from_co2",
        "temperature_change_from_ghg",
        "temperature_change_from_n2o",
        "total_ghg"
    ]

    toGeneralRecord(): GeneralRecord {
        let generalRecord : GeneralRecord = {
            country: this.country,
            year: this.year,
            gdp: isEmpty(this.gdp) ? undefined : this.gdp,
            population: isEmpty(this.population) ? undefined : this.population
        };
        return generalRecord;
    }

    toEmissionRecord(): EmissionRecord {
        let emissionRecord : EmissionRecord = {
            country: this.country,
            year: this.year,
            co2: isEmpty(this.co2) ? undefined : this.co2,
            methane: isEmpty(this.methane) ? undefined : this.methane,
            nitrous_oxide: isEmpty(this.nitrous_oxide) ? undefined : this.nitrous_oxide,
            total_ghg: isEmpty(this.total_ghg) ? undefined : this.total_ghg
        };
        return emissionRecord;
    }

    toTemperatureRecord(): TemperatureRecord {
        let temperatureRecord : TemperatureRecord = {
            country: this.country,
            year: this.year,
            share_of_temperature_change_from_ghg: isEmpty(this.share_of_temperature_change_from_ghg) ? undefined : this.share_of_temperature_change_from_ghg,
            temperature_change_from_co2: isEmpty(this.temperature_change_from_co2) ? undefined : this.temperature_change_from_co2,
            temperature_change_from_n2o: isEmpty(this.temperature_change_from_n2o) ? undefined : this.temperature_change_from_n2o,
            temperature_change_from_ghg: isEmpty(this.temperature_change_from_ghg) ? undefined : this.temperature_change_from_ghg,
            temperature_change_from_ch4: isEmpty(this.temperature_change_from_ch4) ? undefined : this.temperature_change_from_ch4
        };
        return temperatureRecord;
    }

    toEnergyRecord(): EnergyRecord {
        let energyRecord : EnergyRecord = {
            country: this.country,
            year: this.year,
            energy_per_capita: isEmpty(this.energy_per_capita) ? undefined : this.energy_per_capita,
            energy_per_gdp: isEmpty(this.energy_per_gdp) ? undefined : this.energy_per_gdp
        };
        return energyRecord;
    }

    toCountry(): Country {
        let country: Country = {
            country: this.country,
            iso_code: this.iso_code
        }
        return country;
    }

    toContinent(): Continent {
        let continent: Continent = {
            continent: this.country,
        }
        return continent;
    }
}
import { DataSource, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { Min, Max, IsDefined, IsInt, IsIn, IsString, IsOptional, validate } from "class-validator";
import { Continent, continents } from "../models/continent";
import { GeneralRecord } from "../models/general-record";
import Container from "typedi";
import { Country } from "../models/country";
import { TemperatureRecord } from "../models/temperature-record";
import { EmissionRecord } from "../models/emission-record";
import { EnergyRecord } from "../models/energy-record";
import { isISOCode } from "../models/country";
import { NextFunction, Response } from "express";
import { CustomError } from "../error";
import { plainToClass } from "class-transformer";
import { badValidation } from "./validate";

/**
 * Interface that can be implemented by classes to allow different kinds of queries.
 */
export interface IQueryHelper<T extends ObjectLiteral> {
  apply(query: SelectQueryBuilder<T>): SelectQueryBuilder<T>;
}

// Select year in a generic query
export class YearSelector<T extends ObjectLiteral> implements IQueryHelper<T> {
  @IsDefined()
  @IsInt()
  @Min(1900)
  @Max(1999)
  year!: number; 

  constructor(private alias: string) {}

  apply(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    query.andWhere(`${this.alias}.year = :year`, {year: this.year});
    return query;
  }
}

// Select year in a general record query
export class GeneralYearSelector extends YearSelector<GeneralRecord> {
  constructor() {
    super('general_record');
  }
} 

// Select country in a generic query
export class CountrySelector <T extends ObjectLiteral> implements IQueryHelper<T>{
  @IsDefined()
  @IsString()
  country!: string;

  constructor(private alias: string) {}

  apply(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    if (isISOCode(this.country)) {
      const subQuery = Container.get<DataSource>("database").getRepository(Country).createQueryBuilder()
        .select('c.country')
        .from('country', 'c')
        .where('c.iso_code = :iso_code', { iso_code: this.country})
        ;
      query.andWhere(`${this.alias}.country IN (${subQuery.getQuery()})`);
      query.setParameters(subQuery.getParameters());
    } else {
      query.andWhere(`${this.alias}.country = :country`, {country: this.country});
    }
    return query;
  }
}

// Select year in a general record query
export class GeneralCountrySelector extends CountrySelector<GeneralRecord> {
  constructor() {
    super('general_record');
  }
}

// Select year and higher in a generic query
export class YearFilter<T extends ObjectLiteral> implements IQueryHelper<T>{
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(1999)
  year?: number;

  constructor(private alias: string) {}

  apply(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    if (this.year) query.andWhere(`${this.alias}.year >= :year`, { year: this.year });
    return query;
  }
}

// Select year and higher in an emission record query
export class EmissionYearFilter extends YearFilter<EmissionRecord> {
  constructor() {
    super('emission_record');
  }
}

// Select country in an emission record query
export class EmissionCountrySelector extends CountrySelector<EmissionRecord> {
  constructor() {
    super('emission_record');
  }
}

// Select year and higher in a temperature record query
export class TemperatureYearFilter extends YearFilter<TemperatureRecord> {
  constructor() {
    super('temperature_record');
  }
}

// Select continent in a temperature record query
export class TemperatureContinentSelector implements IQueryHelper<TemperatureRecord> {
  @IsDefined()
  @IsString()
  @IsIn(continents)
  continent!: string;
  
  apply(query: SelectQueryBuilder<TemperatureRecord>): SelectQueryBuilder<TemperatureRecord> {
    query.andWhere("temperature_record.country = :continent", {continent: this.continent});
    return query;
  }
}

// Select year in an energy record query
export class EnergyYearSelector extends YearSelector<EnergyRecord> {
  constructor() {
    super('energy_record');
  }
} 

// Sort based on population from general records in an energy record query
export class EnergyPopulationOrder implements IQueryHelper<EnergyRecord> {
  @IsDefined()
  @IsString()
  @IsIn(['DESC', 'ASC'])
  order_dir!: "DESC" | "ASC";

  public apply(query : SelectQueryBuilder<EnergyRecord>) : SelectQueryBuilder<EnergyRecord> {
    const countrySubquery = query
      .subQuery()
      .select('gr.population')
      .from(GeneralRecord, 'gr')
      .where(`gr.country = energy_record.country`)
      .andWhere(`gr.year = energy_record.year`)

    query.orderBy(`(${countrySubquery.getQuery()})`, this.order_dir!);
    return query;
  }
}

// Batch energy record query
export class Batcher implements IQueryHelper<EnergyRecord> {
  @IsDefined()
  @IsInt()
  @IsIn([10, 20, 50, 100])
  batch_size!: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  batch_index!: number;

  apply(query: SelectQueryBuilder<EnergyRecord>): SelectQueryBuilder<EnergyRecord> {
    const skipCount = (this.batch_index - 1) * this.batch_size;
    query.skip(skipCount)
    query.take(this.batch_size);
    return query;
  }
}

// Select a number of countries
export class NumberSelector {
  @IsDefined()
  @IsInt()
  @Min(1)
  num_countries!: number;

  apply(countries: any[]): any[] {
    return countries.slice(0, this.num_countries);
  }
}

// Select a country in a country query
export class CountryCountrySelector extends CountrySelector<Country> {
  constructor() {
    super('country');
  }
}

// Determines whether a country exists
export async function emptyCountryCountryQuery(object: any, res: Response, next: NextFunction) : Promise<boolean> {
  const countryCountrySelector = plainToClass(CountryCountrySelector, object, { enableImplicitConversion: true });
  if (badValidation(await validate(countryCountrySelector, { validationError: { target: true }}), res, next)) return true;
  let countryCountryQuery = Container.get<DataSource>("database").getRepository(Country).createQueryBuilder("country");
  countryCountryQuery = countryCountrySelector.apply(countryCountryQuery);
  let countryCountryCount = await countryCountryQuery.getCount();
  if (countryCountryCount == 0) {
    next(new CustomError("Country not found", 400));
    return true;
  }
  return false;
}

// Select time period in temperature record query
export class PeriodSelector implements IQueryHelper<TemperatureRecord> {
  @IsDefined()
  @IsInt()
  @Min(1900, {groups: ['specific-year']})
  @Max(1999, {groups: ['specific-year']})
  @Min(1, {groups: ['last-m-years']})
  period_value!: number; 
  
  @IsDefined()
  @IsString()
  @IsIn(['specific-year', 'last-m-years'])
  period_type!: string; 

  apply(query: SelectQueryBuilder<TemperatureRecord>): SelectQueryBuilder<TemperatureRecord> {
    if (this.period_type === 'specific-year') {
      query.andWhere(`temperature_record.year = :year`, {year: this.period_value});

    }
    if (this.period_type === 'last-m-years') {
      query.andWhere(`temperature_record.year > ${1999 - this.period_value}`);
    }
    return query;
  }
}
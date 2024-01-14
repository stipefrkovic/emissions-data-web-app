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

/**
 * Creates a class that will select data with a given limit and offset.
 */
export class Paging<T extends ObjectLiteral> implements IQueryHelper<T> {
  @Min(1)
  @Max(100)
  @IsDefined()
  limit!: number;
  offset: number = 0;

  /**
   * Generic method that will skip the specified offset of the data and then keeps the
   * next n data items, in which n is specified by 'limit' in this class.
   * @param query the query that holds the data that might be trimmed.
   * @returns the query with the trimmed data.
   */
  public apply(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    if (!this.limit) this.limit = 100;
    if (!this.offset) this.offset = 0;
    return query.skip(this.offset).take(this.limit);
  }
}

export class EnergyPopulationOrder implements IQueryHelper<EnergyRecord> {
  // @IsDefined()
  // @IsString()
  // @IsIn(['population'])
  // "order-by"?: string;
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

export class YearFilter<T extends ObjectLiteral> {
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

export class TemperatureYearFilter extends YearFilter<TemperatureRecord> {
  constructor() {
    super('temperature_record');
  }
}

export class EmissionYearFilter extends YearFilter<EmissionRecord> {
  constructor() {
    super('emission_record');
  }
}

export class CountrySelector <T extends ObjectLiteral> {
  @IsDefined()
  @IsString()
  "country": string;

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

export class EmissionCountrySelector extends CountrySelector<EmissionRecord> {
  constructor() {
    super('emission_record');
  }
}

export class GeneralCountrySelector extends CountrySelector<GeneralRecord> {
  constructor() {
    super('general_record');
  }
}

export class CountryCountrySelector extends CountrySelector<Country> {
  constructor() {
    super('country');
  }
}

// TODO may be a better way? add try everywhere
// export class EmissionCountrySelector implements IQueryHelper<EmissionRecord> {
//   @IsDefined()
//   @IsString()
//   "country": string;

//   apply(query: SelectQueryBuilder<EmissionRecord>): SelectQueryBuilder<EmissionRecord> {
//     if (isISOCode(this["country"])) {
//       const subQuery = Container.get<DataSource>("database").getRepository(Country).createQueryBuilder()
//         .select('c.country')
//         .from('country', 'c')
//         .where('c.iso_code = :iso_code', { iso_code: this.country})
//         ;
//       query.andWhere(`emission_record.country IN (${subQuery.getQuery()})`);
//       query.setParameters(subQuery.getParameters());
//     } else {
//       query.andWhere("emission_record.country = :country", {country: this["country"]});
//     }
//     return query;
//   }
// }


// TODO may be a better way? add try everywhere
// export class CountrySelector implements IQueryHelper<GeneralRecord> {
//   @IsDefined()
//   @IsString()
//   "country": string;

//   apply(query: SelectQueryBuilder<GeneralRecord>): SelectQueryBuilder<GeneralRecord> {
//     if (isISOCode(this["country"])) {
//       const subQuery = Container.get<DataSource>("database").getRepository(Country).createQueryBuilder()
//         .select('c.country')
//         .from('country', 'c')
//         .where('c.iso_code = :iso_code', { iso_code: this.country})
//         ;
//       query.andWhere(`general_record.country IN (${subQuery.getQuery()})`);
//       query.setParameters(subQuery.getParameters());
//     } else {
//       query.andWhere("general_record.country = :country", {country: this["country"]});
//     }
//     return query;
//   }
// }

export class Batcher implements IQueryHelper<EnergyRecord> {

  @IsDefined()
  @IsInt()
  @IsIn([10, 20, 50, 100])
  "batch-size": number;

  @IsDefined()
  @IsInt()
  @Min(1)
  "batch-index": number;

  apply(query: SelectQueryBuilder<EnergyRecord>): SelectQueryBuilder<EnergyRecord> {
    const skipCount = (this["batch-index"] - 1) * this["batch-size"];
    query.skip(skipCount)
    query.take(this["batch-size"]);
    return query;
  }
}

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

export class GeneralYearSelector extends YearSelector<GeneralRecord> {
  constructor() {
    super('general_record');
  }
} 

export class EnergyYearSelector extends YearSelector<EnergyRecord> {
  constructor() {
    super('energy_record');
  }
} 

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

export class NumberSelector {
  @IsDefined()
  @IsInt()
  @Min(1)
  num_countries!: number;

  apply(countries: any[]): any[] {
    return countries.slice(0, this.num_countries);
  }
}

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
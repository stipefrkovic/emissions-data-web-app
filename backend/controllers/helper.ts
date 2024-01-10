import { DataSource, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { Min, Max, IsDefined, ValidationError, IsInt, ValidateIf, IsISO31661Alpha3, IsIn, IsString, IsOptional } from "class-validator";
// import { Record} from "../models/record";
import Papa from "papaparse";
import { Request, Response } from "express";
import { isContinent } from "../models/continent";
import { GeneralRecord } from "../models/general-record";
import Container from "typedi";
import { Country } from "../models/country";
import { TemperatureRecord } from "../models/temperature-record";
import { EmissionRecord } from "../models/emission-record";

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

// TODO check error if order-by is not defined
// export class Order implements IQueryHelper<Record> {
//   "order-by"?: string;
//   "order-dir"?: string;

//   public apply(query : SelectQueryBuilder<Record>) : SelectQueryBuilder<Record> {
//       if (!this["order-by"] || !this["order-dir"]) {
//         return query;
//       }
//       return query.orderBy(this["order-by"], this["order-dir"] === "DESC" ? "DESC" : "ASC");
//   }
// }

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

// export class HigherYearFilter implements IQueryHelper<EmissionRecord> {
//   @IsOptional()
//   @IsInt()
//   @Min(1900)
//   @Max(1999)
//   year?: number;
//   // "ncountries": number;
//   // "period-type": string;
//   // "period-value": number;

//   public apply(query : SelectQueryBuilder<EmissionRecord>) : SelectQueryBuilder<EmissionRecord> {
//       if (this["year"]) query.andWhere("emission_record.year >= :year", { year: this.year });
//       // if (this["period-value"] && this["period-type"] == "specific-year"){
//       //   query = query.andWhere("record.year = :year", { year: this["period-value"] });
//       // } else if(this["period-value"]){
//       //   query = query.andWhere("record.year >= :year", { year: 2000-this["period-value"] });
//       // }
//       // if(this.ncountries) query = query.limit(this.ncountries);
//       return query;
//   }
// }

// export class TemperatureHigherYearFilter implements IQueryHelper<TemperatureRecord> {
//   @IsOptional()
//   @IsInt()
//   @Min(1900)
//   @Max(1999)
//   year?: number;
//   // "ncountries": number;
//   // "period-type": string;
//   // "period-value": number;

//   public apply(query : SelectQueryBuilder<TemperatureRecord>) : SelectQueryBuilder<TemperatureRecord> {
//       if (this["year"]) query.andWhere("temperature_record.year >= :year", { year: this.year });
//       // if (this["period-value"] && this["period-type"] == "specific-year"){
//       //   query = query.andWhere("record.year = :year", { year: this["period-value"] });
//       // } else if(this["period-value"]){
//       //   query = query.andWhere("record.year >= :year", { year: 2000-this["period-value"] });
//       // }
//       // if(this.ncountries) query = query.limit(this.ncountries);
//       return query;
//   }
// }

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

export class YearSelector implements IQueryHelper<GeneralRecord> {
  @IsDefined()
  @IsInt()
  @Min(1900)
  @Max(1999)
  "year": number; 
  apply(query: SelectQueryBuilder<GeneralRecord>): SelectQueryBuilder<GeneralRecord> {
    query.andWhere("general_record.year = :year", {year: this.year});
    return query;
  }
}

export class ContinentSelector implements IQueryHelper<TemperatureRecord> {
  @IsDefined()
  @IsString()
  continent!: string;
  apply(query: SelectQueryBuilder<TemperatureRecord>): SelectQueryBuilder<TemperatureRecord> {
    query.andWhere("temperature_record.continent = :continent", {continent: this.continent});
    return query;
  }
}

// may throw error, call in try-catch block
export function jsonToCSV(data: any): string {
  let csv = Papa.unparse(data);
  return csv;
}

export function isISOCode(id: string): boolean {
  return (/^[A-Z]{3}$/).test(id);
}




export function alreadyExists(count: number, res: Response): boolean {
  if (count > 0) {
    res.status(409);
    res.json({ error: "Record with the same name already exists" });
    return true;
  }
  return false;
}

export function resourceConvertor(result: any, req: Request, res: Response) {
  let acceptHeader = req.headers['accept'];
  if (acceptHeader) {
    if (acceptHeader === 'text/csv') {
      try {
        res.setHeader('Content-Type', 'text/csv')
        res.send(jsonToCSV(result));
      } catch (error) {
        console.log(error);
        res.status(500);
        res.send('Server error; no results, try again later');
      }
      return;
    }
  }
  res.json(result);
}

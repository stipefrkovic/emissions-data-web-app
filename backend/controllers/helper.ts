import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { Min, Max, IsDefined, ValidationError } from "class-validator";
import { Record} from "../models/record";
import Papa from "papaparse";
import { Request, Response } from "express";
import { isContinent } from "../models/continents";

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

export class Order implements IQueryHelper<Record> {
  "order-by"?: string;
  "order-dir"?: string;

  public apply(query : SelectQueryBuilder<Record>) : SelectQueryBuilder<Record> {
      if (!this["order-by"] || !this["order-dir"]) return query;
      return query.orderBy(this["order-by"], this["order-dir"] === "DESC" ? "DESC" : "ASC");
  }
}

export class Filter implements IQueryHelper<Record> {
  "year"?: number;
  "ncountries"?: number;
  "period-type"?: string;
  "period-value"?: number;

  public apply(query : SelectQueryBuilder<Record>) : SelectQueryBuilder<Record> {
      if (this["year"]) query = query.andWhere("record.year >= :year", { year: this.year });
      if (this["period-value"] && this["period-type"] == "specific-year"){
        query = query.andWhere("record.year = :year", { year: this["period-value"] });
      } else if(this["period-value"]){
        query = query.andWhere("record.year >= :year", { year: 2000-this["period-value"] });
      }
      if(this.ncountries) query = query.limit(this.ncountries);
      return query;
  }

}

export class CountrySelector implements IQueryHelper<Record> {
  "country"!: string;

  apply(query: SelectQueryBuilder<Record>): SelectQueryBuilder<Record> {
    if (isISOCode(this["country"])) {
      query.andWhere("record.iso_code = :iso_code", {iso_code: this["country"]});
    } else {
      console.log("country:")
      console.log(this["country"]);
      query.andWhere("record.country = :country", {country: this["country"]});
    }
    return query;
  }
}

export class YearSelector implements IQueryHelper<Record> {
  "year"!: number; 
  apply(query: SelectQueryBuilder<Record>): SelectQueryBuilder<Record> {
    query.andWhere("record.year = :year", {year: this["year"]});
    return query;
  }
}

export class ContinentSelector implements IQueryHelper<Record> {
  "country"!: string;
  apply(query: SelectQueryBuilder<Record>): SelectQueryBuilder<Record> {
    if (isContinent(this["country"])) {
      query.andWhere("record.country = :continent", {continent: this["country"]});
      return query;
    } else {
      throw new Error("The request body has an invalid entry.");
    }
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

export function noResource(result: any, res: Response): boolean {
  if (!result) {
    console.log(result);
    res.status(404);
    res.json({error: "Resource not found"});
    return true;
  }
  return false;
}

export function emptyList(list: any, res: Response): boolean {
  if (list.length == 0) {
    res.status(204);
    res.json({message: "List empty; no results"});
    return true;
  }
  return false;
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
    } else if (acceptHeader !== 'application/json') {
      res.status(400);
      res.json({
        "error-message": "The request body has an invalid entry."
      });
      return;
    }
  }
  res.json(result);
}

export function invalidValidation(validation: ValidationError[], res: Response): boolean {
  if (validation.length > 0) {
    res.status(400);
    res.json({ error: "Record validation error", details: validation });
    return true;
  }
  return false;
}
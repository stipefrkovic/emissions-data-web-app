import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { Min, Max, IsDefined } from "class-validator";
import { Record} from "../models/record"

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
  "order-by": string;
  "order": string;

  public apply(query : SelectQueryBuilder<Record>) : SelectQueryBuilder<Record> {
      if(!this["order-by"] || !this["order"]) return query;
      return query.orderBy(this["order-by"], this["order"] === "desc" ? "DESC" : "ASC");
  }
}

export class Filter implements IQueryHelper<Record> {
  year?: number;

  public apply(query : SelectQueryBuilder<Record>) : SelectQueryBuilder<Record> {
      if(this.year) query = query.andWhere("record.year >= :year", { year: this.year });
      return query;
  }
}

import { NextFunction, Request, Response } from "express";
import { resourceConvertor } from "./controllers/helper";

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err.statusCode) {
        res.status(err.statusCode);
    } else {
        res.status(500);
    }
    res.json({'error-message': err.message});
    return res;
};

export class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = 'CustomError';
      this.statusCode = statusCode;
    }
}

export function resourceNotFound(result: any, res: Response, next: NextFunction) {
    if (!result) {
        let error = new CustomError("Resource not found", 404);
        next(error);
        return true;
    }
    return false;
}

export function emptyList(list: any, req: Request, res: Response): boolean {
    if (list.length == 0) {
      res.status(204);
      resourceConvertor({message: "List empty; no results"}, req, res);
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
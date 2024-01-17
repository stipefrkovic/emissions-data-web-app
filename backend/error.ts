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

export function emptyList(list: any, req: Request, res: Response, message: string): boolean {
  if (list.length == 0) {
    res.status(204);
    resourceConvertor({message: message}, req, res);
    return true;
  }
  return false;
}

export function resourceNotFound(result: any) {
    if (!result) {
      throw new CustomError("Resource not found", 404);
    }
}

export function alreadyExists(count: number) {
  if (count > 0) {
    throw new CustomError("Record with the same name already exists", 409)
  }
}

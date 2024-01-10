import { NextFunction, Request, Response } from "express";

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
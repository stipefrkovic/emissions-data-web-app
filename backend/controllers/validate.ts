import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { ApiFullGeneralRecord, ApiGeneralRecord } from '../api-models/general-record';
import { CountrySelector } from './query';
import { CustomError } from '../error';

// Determine and handle validation error, if it exists
export function badValidation(validationErrors: ValidationError[]) {
    if (validationErrors.length > 0) {
      throw new CustomError(String(validationErrors), 400);
    }
};

// Validate an ApiFullGeneralRecord
export const validateApiFullGeneralRecord = (req: Request, res: Response, next: NextFunction) => {
    const apiFullGeneralRecord = plainToClass(ApiFullGeneralRecord, req.body);
    validate(apiFullGeneralRecord, { validationError: { target: false }, skipMissingProperties: true }).then((errors) => {
        badValidation(errors);
        req.body = apiFullGeneralRecord;
        next()
    });
};

// Validate an ApiGeneralRecord
export const validateApiGeneralRecord = (req: Request, res: Response, next: NextFunction) => {
    const apiGeneralRecord = plainToClass(ApiGeneralRecord, req.body);
    validate(apiGeneralRecord, { validationError: { target: false }, skipMissingProperties: true }).then((errors) => {
        badValidation(errors);
        req.body = apiGeneralRecord;
        next()
    });
};

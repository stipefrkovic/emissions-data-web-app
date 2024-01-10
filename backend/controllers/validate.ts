import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { ApiFullGeneralRecord, ApiGeneralRecord } from '../api-models/general';
import { CountrySelector } from './helper';

// TODO check missing properties setting

export function badValidation(validationErrors: ValidationError[], res: Response, next: NextFunction) : boolean {
    if (validationErrors.length > 0) {
      res.status(400)
      let error: Error = new Error(String(validationErrors));
      next(error)
      return true;
    }
    return false;
};

export const validateApiFullGeneralRecord = (req: Request, res: Response, next: NextFunction) => {
    const apiFullGeneralRecord = plainToClass(ApiFullGeneralRecord, req.body);
    validate(apiFullGeneralRecord, { validationError: { target: false }, skipMissingProperties: true }).then((errors) => {
        if (badValidation(errors, res, next)) {
            return;
        }
        req.body = apiFullGeneralRecord;
        next()
    });
};

export const validateApiGeneralRecord = (req: Request, res: Response, next: NextFunction) => {
    const apiGeneralRecord = plainToClass(ApiGeneralRecord, req.body);
    validate(apiGeneralRecord, { validationError: { target: false }, skipMissingProperties: true }).then((errors) => {
        if (badValidation(errors, res, next)) {
            return;
        }
        req.body = apiGeneralRecord;
        next()
    });
};

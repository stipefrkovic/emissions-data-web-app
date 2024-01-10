import { Application, NextFunction, Request, Response } from "express";
import { IRouter } from "./irouter";
import asyncHandler from "express-async-handler";

import { RecordsController } from "../controllers/records-controller"; 
import { validateApiFullGeneralRecord, validateApiGeneralRecord } from "../controllers/validate";
import { errorHandler } from "../error";

export class RecordsRouter implements IRouter {
    protected controller : RecordsController = new RecordsController;

    public attach(app: Application): void {
        app.route('/records/:country/:year/general')
            .get(asyncHandler(this.controller.getGeneralRecordAsync))
            .put(validateApiGeneralRecord, asyncHandler(this.controller.updateGeneralRecordAsync))
            .delete(asyncHandler(this.controller.deleteGeneralRecordAsync))

        app.route('/records/general')
            .post(validateApiFullGeneralRecord, asyncHandler(this.controller.createGeneralRecordAsync))

        app.route('/records/:country/emission')
            .get(asyncHandler(this.controller.getEmissionRecordAsync))
            
        app.route('/records/:continent/temp-change')
            .get(asyncHandler(this.controller.getTemperatureRecordAsync))

        // app.route('/records/:year/energy')
        //     .get(asyncHandler(this.controller.getEnergyRecordsAsync))
        
        // app.route('/records/countries')
        //     .get(asyncHandler(this.controller.getCountriesAsync))

        app.route('/records')
            .post(asyncHandler(this.controller.createRecordsAsync))

        app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).json({ 'error-message': 'Resource not found' });
        });

        app.use(errorHandler)
    }

    // TODO 404 error
}
import { Application } from "express";
import { IRouter } from "./irouter";
import asyncHandler from "express-async-handler";

import { RecordsController } from "../controllers/records-controller"; 

export class RecordsRouter implements IRouter {
    protected controller : RecordsController = new RecordsController;

    public attach(app: Application): void {
        app.route('/records/:country/:year/general')
            .get(asyncHandler(this.controller.getGeneralRecordAsync))
            .put(asyncHandler(this.controller.updateGeneralRecordAsync))
            .delete(asyncHandler(this.controller.deleteGeneralRecordAsync))

        app.route('/records/general')
            .post(asyncHandler(this.controller.createGeneralRecordAsync))

        app.route('/records/:country/emission')
            .get(asyncHandler(this.controller.getEmissionAsync))
            
        app.route('/records/:continent/temp-change')
            .get(asyncHandler(this.controller.getTempChangeAsync))

        app.route('/records/:year/energy')
            .get(asyncHandler(this.controller.getEnergyRecordsAsync))
        
        app.route('/records/countries')
            .get(asyncHandler(this.controller.getCountriesAsync))

    }

    // TODO 404 error
}
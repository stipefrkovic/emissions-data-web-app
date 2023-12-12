import { Application } from "express";
import { IRouter } from "./irouter";
import asyncHandler from "express-async-handler";

import { RecordsController } from "../controllers/records-controller"; 

export class RecordsRouter implements IRouter {
    protected controller : RecordsController = new RecordsController;

    public attach(app: Application): void {
        app.route('/records')
            .get(asyncHandler(this.controller.getAllRecords))
        app.route('/records/general')
            .post(asyncHandler(this.controller.createRecordAsync))

        app.route('/records/:id/:year/general')
            .get(asyncHandler(this.controller.getRecordAsync))
            .put(asyncHandler(this.controller.updateRecordAsync))
            .delete(asyncHandler(this.controller.deleteRecordAsync))

        app.route('/records/:id/emission')
            .get(asyncHandler(this.controller.getEmissionAsync))

        app.route('/records/:continent/temp-change')
            .get(asyncHandler(this.controller.getTempChangeAsync))

        app.route('/records/:year/energy')
            .get(asyncHandler(this.controller.getEnergyInYearAsync))

        app.route('/records/countries')
            .get(asyncHandler(this.controller.getCountriesAsync))
    }
}
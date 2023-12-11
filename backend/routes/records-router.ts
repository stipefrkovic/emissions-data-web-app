import { Application } from "express";
import { IRouter } from "./irouter";
import * as asyncHandler from "express-async-handler";

import { RecordsController } from "../controllers/records-controller"; 

export class RecordsRouter implements IRouter {
    protected controller : RecordsController = new RecordsController;

    public attach(app: Application): void {
        app.route('/records').get(asyncHandler(this.controller.getAllRecords))
    }
}
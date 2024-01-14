import { DataSource } from "typeorm";
import { config as dotenvConfig } from "dotenv";
import Container from "typedi";

import app from "./app";
import { GeneralRecord } from "./models/general-record";
import { EmissionRecord } from "./models/emission-record";
import { TemperatureRecord } from "./models/temperature-record";
import { Country } from "./models/country";
import { EnergyRecord } from "./models/energy-record";
import { Continent } from "./models/continent";

const BACKEND_PORT = process.env.BACKEND_PORT as unknown as number || 3000;
const HOST = process.env.HOST || "localhost";
                                                                                                                                                                                                                                                                                                                                                                                                           
const database = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST || "localhost",
    port: 3306,
    username: process.env.DATABASE_USERNAME || "mariadb",
    password: process.env.DATABASE_PASSWORD || "mariadb",
    database: process.env.DATABASE_NAME || "emissions",
    entities: [
         GeneralRecord, EmissionRecord, EnergyRecord, Country, TemperatureRecord, Continent
    ],
    synchronize: true,
    logging: false
});

database.initialize().then(database => {
    Container.set<DataSource>("database", database);
    console.log("Connected to database:")
    console.log(database.options);
    const server = app.listen(BACKEND_PORT, HOST, () => console.log(`Backend server started on port ${BACKEND_PORT}`));
}).catch(console.error)


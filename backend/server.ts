// import "reflect-metadata"
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

const PORT = process.env.PORT as unknown as number || 3000;
const HOST = process.env.HOST || "localhost";

const database = new DataSource({
    type: "mysql",
    host: "mariadb",
    port: 3306,
    username: "mariadb",
    password: "mariadb",
    database: "emissions",
    entities: [
         GeneralRecord, EmissionRecord, EnergyRecord, Country, TemperatureRecord, Continent
    ],
    synchronize: true,
    logging: false
});

database.initialize().then(database => {
    Container.set<DataSource>("database", database);
    app.listen(PORT, HOST, () => console.log(`Backend server listening on port ${PORT}`));
}).catch(console.log)


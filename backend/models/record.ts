import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm"

@Entity({name: "records"})
export class Record {
    @PrimaryColumn()
    country!: string;
    
    @PrimaryColumn()
    year!: number;

    @Column()
    iso_code?: string;

    @Column()
    population?: number;

    @Column()
    co2?: number;

    @Column()
    energy_per_capita?: number;

    @Column()
    energy_per_gdp?: number;

    @Column()
    methane?: number;

    @Column()
    nitrous_oxide?: number;

    @Column()
    share_of_temperature_change_from_ghg?: number;

    @Column()
    temperature_change_from_ch4?: number;

    @Column()
    temperature_change_from_co2?: number;

    @Column()
    temperature_change_from_ghg?: number;

    @Column()
    temperature_change_from_n2o?: number;  

}
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm"

@Entity({name: "records"})
export class Record {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;
    
    @PrimaryColumn({ type: 'int'})
    year!: number;

    @PrimaryColumn({ type: 'varchar'})
    iso_code?: string;

    @Column({ type: 'int'})
    gdp?: number;

    @Column({ type: 'double' })
    population?: number;

    @Column({ type: 'double' })
    co2?: number;

    @Column({ type: 'double' })
    energy_per_capita?: number;

    @Column({ type: 'double' })
    energy_per_gdp?: number;

    @Column({ type: 'double' })
    methane?: number;

    @Column({ type: 'double' })
    nitrous_oxide?: number;

    @Column({ type: 'double' })
    share_of_temperature_change_from_ghg?: number;

    @Column({ type: 'double' })
    temperature_change_from_ch4?: number;

    @Column({ type: 'double' })
    temperature_change_from_co2?: number;

    @Column({ type: 'double' })
    temperature_change_from_ghg?: number;

    @Column({ type: 'double' })
    temperature_change_from_n2o?: number;  

    @Column({ type: 'double' })
    total_ghg?: number;
}
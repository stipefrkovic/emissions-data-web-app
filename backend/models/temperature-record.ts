import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TemperatureRecord {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;

    @PrimaryColumn({ type: 'int'})
    year!: number;

    @Column({ type: 'double', nullable: true })
    share_of_temperature_change_from_ghg?: number;

    @Column({ type: 'double', nullable: true })
    temperature_change_from_ch4?: number;

    @Column({ type: 'double', nullable: true })
    temperature_change_from_co2?: number;

    @Column({ type: 'double', nullable: true })
    temperature_change_from_ghg?: number;

    @Column({ type: 'double', nullable: true })
    temperature_change_from_n2o?: number;  
}
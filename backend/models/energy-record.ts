import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class EnergyRecord {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;

    @PrimaryColumn({ type: 'int'})
    year!: number;

    @Column({ type: 'double', nullable: true })
    energy_per_capita?: number;

    @Column({ type: 'double', nullable: true })
    energy_per_gdp?: number;
}
import { Column, Entity, PrimaryColumn } from "typeorm";

// General record entity for the database
@Entity()
export class GeneralRecord {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;

    @PrimaryColumn({ type: 'int'})
    year!: number;

    @Column({ type: 'bigint', nullable: true })
    gdp?: number;

    @Column({ type: 'bigint', nullable: true })
    population?: number;
}
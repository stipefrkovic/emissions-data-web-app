import { Column, Entity, PrimaryColumn } from "typeorm";

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
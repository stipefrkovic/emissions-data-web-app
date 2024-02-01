import { Column, Entity, PrimaryColumn } from "typeorm";

// Emission record entity for the database
@Entity()
export class EmissionRecord {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;

    @PrimaryColumn({ type: 'int'})
    year!: number;

    @Column({ type: 'double', nullable: true })
    co2?: number;

    @Column({ type: 'double', nullable: true })
    methane?: number;

    @Column({ type: 'double', nullable: true })
    nitrous_oxide?: number;
    
    @Column({ type: 'double', nullable: true })
    total_ghg?: number;
}
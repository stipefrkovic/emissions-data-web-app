import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Country {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;

    @Column({ type: 'varchar'})
    iso_code!: string;
}
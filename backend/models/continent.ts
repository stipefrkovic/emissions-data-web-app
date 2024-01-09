import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Continent {
    @PrimaryColumn({ type: 'varchar'})
    continent!: string;
}
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { GeneralRecord } from "./general-record";
import { EmissionRecord } from "./emission-record";
import { EnergyRecord } from "./energy-record";

@Entity()
export class Country {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;

    @Column({ type: 'varchar'})
    iso_code!: string;
}

export function isISOCode(id: string): boolean {
  return (/^[A-Z]{3}$/).test(id);
}

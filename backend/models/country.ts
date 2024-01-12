import { Column, Entity, PrimaryColumn } from "typeorm";

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

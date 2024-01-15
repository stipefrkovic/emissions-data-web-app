import { Column, Entity, PrimaryColumn } from "typeorm";

// Country entity for the database
@Entity()
export class Country {
    @PrimaryColumn({ type: 'varchar'})
    country!: string;

    @Column({ type: 'varchar'})
    iso_code!: string;
}

// Check if string is of ISO31661Alpha3 code format
export function isISOCode(id: string): boolean {
  return (/^[A-Z]{3}$/).test(id);
}

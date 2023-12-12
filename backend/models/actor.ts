import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";

@Entity({ name: "Actors" })
export class Actor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name?: string;

}
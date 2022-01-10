import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 70 }, )
    full_name: string;

    @Column("varchar", { length: 100 })
    email: string;

    @Column("varchar", { length: 15 })
    phone_number: string;

    @Column("varchar", { length: 30 })
    username: string;

    @Column("varchar", { length: 60 })
    password: string;
}
import { IsDate, IsNumber, IsString, MaxLength } from "class-validator";
import { Permission } from "../permission/entities/permission.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

enum ProfileStatus {
    Activo = 1,
    Inactivo = 2,
    Bloqueado = 3,
}

@Entity({ name: 'userProfile' })
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    name: string;

    @Column({ nullable: true })
    @IsString()
    @MaxLength(150, { message: 'Máximo 150 caracteres' })
    description: string;

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];

    @Column({ nullable: false, default: "Active" })
    @IsString()
    status: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    createDate: Date;

    @Column({ nullable: true, type: 'datetime' })
    @IsDate()
    updateDate: Date;

}

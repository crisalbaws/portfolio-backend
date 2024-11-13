import { IsString, MaxLength } from "class-validator";
import { Profile } from "../profiles/profile.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne } from "typeorm";


@Entity({ name: 'users' })
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    secondLastName: string;

    @Column({ nullable: false })
    completeName: string;

    @Column({ nullable: false, default: "Active" })
    status: string;

    @ManyToOne(() => Profile, { eager: true })
    @JoinColumn()
    userProfile: Profile;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, unique: true })
    phoneNumber: string;

    @Column({ nullable: false })
    password: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({ nullable: true, type: 'datetime' })
    updateDate: Date;
}
import { IsDate, IsString } from "class-validator";
import { Profile } from "../../profiles/profile.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: false, unique: true })
    code: string;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    createDate: Date;

    @Column({ nullable: true, type: 'datetime' })
    @IsDate()
    updateDate: Date;

    @ManyToMany(() => Profile, profile => profile.permissions)
    profile: Profile[];

    @Column({ nullable: false, default: "Active" })
    @IsString()
    status: string;

}
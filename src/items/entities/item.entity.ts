import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ItemCategory, ItemStatus, ItemType } from '../items-enums';

@Entity({ name: 'items' })
export class ItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ enum: ItemCategory })
    category: ItemCategory;

    @Column({ enum: ItemStatus })
    status: ItemStatus;

    @Column({ enum: ItemType })
    type: ItemType;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    creationDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updateDate?: Date;

    @Column()
    userCreationName: string;

    @Column()
    userCreationId: string;

    @Column({ nullable: true })
    userUpdateName?: string;

    @Column({ nullable: true })
    userUpdateId?: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    measures?: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ nullable: true })
    idProviderCreated: number;

    @Column({ nullable: true })
    idProviderUpdated: number;


}

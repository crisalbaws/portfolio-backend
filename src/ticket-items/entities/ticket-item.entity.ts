import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TicketEntity } from '../../tickets/entities/ticket.entity';
import { ItemEntity } from '../../items/entities/item.entity';
import { TicketItemStatus } from '../ticket-items-enums';

@Entity('ticket_items')
export class TicketItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TicketEntity, ticket => ticket.ticketItems, { onDelete: 'CASCADE' })
  ticket: TicketEntity;

  @ManyToOne(() => ItemEntity, { eager: true })
  item: ItemEntity;

  @Column()
  itemName: string;

  @Column('decimal')
  itemPrice: number;

  @Column()
  quantity: number;

  @Column({ enum: TicketItemStatus, default: TicketItemStatus.Active })
  status: TicketItemStatus;
}
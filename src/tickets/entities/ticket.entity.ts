import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { TicketStatus, TicketType } from '../tickets-enums';
import { IsEnum } from 'class-validator';
import { TicketItemEntity } from '../../ticket-items/entities/ticket-item.entity';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  folio: string;

  @Column({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @Column({ enum: TicketType })
  @IsEnum(TicketType)
  ticketType: string;

  @Column()
  category: string;

  @Column()
  idCategory: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @Column()
  userCreationName: string;

  @Column({ nullable: true })
  price?: number;

  @Column()
  userCreationId: string;

  @Column({ nullable: false })
  customerId: string;


  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updateDate: Date;

  @Column()
  userUpdateName: string;

  @Column({ nullable: true })
  userUpdateId: string;

  @Column({ nullable: true })
  customerName: string;

  @Column()
  channel: string;

  @OneToMany(() => CommentEntity, comment => comment.ticket, { cascade: true })
  comments: CommentEntity[];

  @OneToMany(() => TicketItemEntity, ticketItem => ticketItem.ticket, { cascade: true })
  ticketItems?: TicketItemEntity[];

  @Column({ nullable: true })
  idProvider?: number;
}
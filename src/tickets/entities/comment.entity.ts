import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { TicketEntity } from './ticket.entity';
import { AttachmentEntity } from './attachment.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  userIdCreated: string;

  @Column()
  userNameCreated: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createDate: Date;

  @Column()
  comment: string;

  @ManyToOne(() => TicketEntity, ticket => ticket.comments)
  ticket: TicketEntity;

  @OneToMany(() => AttachmentEntity, attachment => attachment.comment, { cascade: true })
  attachments: AttachmentEntity[];
}
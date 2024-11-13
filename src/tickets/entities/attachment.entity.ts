import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Entity('attachments')
export class AttachmentEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  uri: string;

  @Column()
  name: string;

  @ManyToOne(() => CommentEntity, comment => comment.attachments)
  comment: CommentEntity;
}
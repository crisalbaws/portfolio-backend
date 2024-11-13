import { Module } from '@nestjs/common';
import { CommonService } from '../common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketEntity } from './entities/ticket.entity';
import { AttachmentEntity } from './entities/attachment.entity';
import { CommentEntity } from './entities/comment.entity';
import { TokenService } from '../common/token.service';
import { User } from '../users/user.entity';
import { TicketItemEntity } from '../ticket-items/entities/ticket-item.entity';
import { ItemEntity } from '../items/entities/item.entity';

@Module({
  controllers: [TicketController],
  providers: [CommonService, TicketService, TokenService],
  imports: [TypeOrmModule.forFeature([
    TicketEntity,
    CommentEntity,
    AttachmentEntity,
    User,
    TicketItemEntity,
    ItemEntity,
  ])],
  exports: [TicketService, TypeOrmModule.forFeature([
    TicketEntity,
    AttachmentEntity,
    CommentEntity,
    User,
    TicketItemEntity,
    ItemEntity,
  ])],
})
export class TicketModule { }

import { Module } from '@nestjs/common';
import { CommonService } from '../common/common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { CommentEntity } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { S3Client } from '@aws-sdk/client-s3';
import { TicketModule } from './ticket.module';

@Module({
  controllers: [CommentController],
  providers: [S3Client, CommonService, TicketService, CommentService],
  imports: [TicketModule, TypeOrmModule.forFeature([CommentEntity])],
})
export class CommentModule {}

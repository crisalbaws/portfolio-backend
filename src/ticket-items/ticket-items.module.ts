import { Module } from '@nestjs/common';
import { TicketItemsService } from './ticket-items.service';
import { TicketItemsController } from './ticket-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketItemEntity } from './entities/ticket-item.entity';

@Module({
  controllers: [TicketItemsController],
  providers: [TicketItemsService],
  imports: [TypeOrmModule.forFeature([TicketItemEntity])],
})
export class TicketItemsModule { }

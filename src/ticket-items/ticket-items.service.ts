import { Injectable } from '@nestjs/common';
import { CreateTicketItemDto } from './dto/create-ticket-item.dto';
import { UpdateTicketItemDto } from './dto/update-ticket-item.dto';

@Injectable()
export class TicketItemsService {
  create(createTicketItemDto: CreateTicketItemDto) {
    return 'This action adds a new ticketItem';
  }

  findAll() {
    return `This action returns all ticketItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketItem`;
  }

  update(id: number, updateTicketItemDto: UpdateTicketItemDto) {
    return `This action updates a #${id} ticketItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketItem`;
  }
}

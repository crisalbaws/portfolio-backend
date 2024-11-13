import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketItemsService } from './ticket-items.service';
import { CreateTicketItemDto } from './dto/create-ticket-item.dto';
import { UpdateTicketItemDto } from './dto/update-ticket-item.dto';

@Controller('ticket-items')
export class TicketItemsController {
  constructor(private readonly ticketItemsService: TicketItemsService) {}

  @Post()
  create(@Body() createTicketItemDto: CreateTicketItemDto) {
    return this.ticketItemsService.create(createTicketItemDto);
  }

  @Get()
  findAll() {
    return this.ticketItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketItemDto: UpdateTicketItemDto) {
    return this.ticketItemsService.update(+id, updateTicketItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketItemsService.remove(+id);
  }
}

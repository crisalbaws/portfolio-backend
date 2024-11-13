import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, ParseEnumPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { TicketCreateRequestDto } from './dto/create-ticket.dto';
import { ApiResponse } from '../common/response.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { TicketStatus } from './tickets-enums';
import { TicketCloseRequestDto } from './dto/close-ticket.dto';

@ApiTags('tickets')
@Controller('api/ticket')
@ApiBearerAuth()
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Post()
  async create(@Body() createTicketDto: TicketCreateRequestDto): Promise<ApiResponse> {
    return this.ticketService.create(createTicketDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  findAllTicketsWithCommentsAndAttachments(@Req() request: any): Promise<ApiResponse> {
    return this.ticketService.findAllTicketsWithCommentsAndAttachments(request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/byid/:id')
  findOne(@Param('id') id: string): Promise<ApiResponse> {
    return this.ticketService.findTicketById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  createNewComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto): Promise<ApiResponse> {
    return this.ticketService.createComment(createCommentDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/:status')
  updateStatusTicketById(
    @Param('id') id: string,
    @Param('status', new ParseEnumPipe(TicketStatus)) status: TicketStatus,
  ): Promise<ApiResponse> {
    return this.ticketService.updateStatusTicketById(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-items-and-close')
  closeTicket( @Body() closeTicket: TicketCloseRequestDto): Promise<ApiResponse> {
    return this.ticketService.closeTicket(closeTicket);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAppVersionDto: UpdateAppVersionDto): Promise<ApiResponse> {
  //   return this.appVersionService.update(+id, updateAppVersionDto);
  // }
}

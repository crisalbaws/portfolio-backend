import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Get, Post, Body, Param, Request, UseGuards, UseInterceptors, UploadedFile, Header, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../common/response.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('comment')
@Controller('api/comment')
@UseGuards(JwtAuthGuard)

export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get('/ticket/:id')
  findOne(@Param('id') id: string): Promise<ApiResponse> {
    return this.commentService.findAllCommentsByTicketId(id);
  }

  @Post(':id')
  create(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto | CreateCommentDto[]): Promise<ApiResponse> {
    return this.commentService.create(createCommentDto, id);
  }

  @Put('/commnet-attachment/:id')
  @UseInterceptors(FileInterceptor('file'))
  async saveImage(
    @Request() req: any,
    @UploadedFile() file,
    @Param('id') id: string,
    @Req() request: any
  ): Promise<ApiResponse> {
    const imageUrl = await this.commentService.uploadImage(file, id, request.body ? req.folder : 'ticketsFolder');
    return this.commentService.updateAttachment(id, imageUrl);
  }
}

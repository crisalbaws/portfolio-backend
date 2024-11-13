import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ApiResponse } from '../common/response.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ItemType } from './items-enums';

@ApiTags('items')
@UseGuards(JwtAuthGuard)
@Controller('api/items')
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  async create(@Body() createItemDto: CreateItemDto, @Req() request: any): Promise<ApiResponse> {
    return this.itemsService.create(createItemDto, request.user.userId);
  }

  @Get()
  findAll(): Promise<ApiResponse> {
    return this.itemsService.findAll();
  }

  @Get('/provider/:id')
  findByProducer(@Param('id') id: number): Promise<ApiResponse> {
    return this.itemsService.findByProducer(id);
  }

  @Patch(':id/:type')
  updateItemType(@Param('id') id: number, @Param('type') type: ItemType): Promise<ApiResponse> {
    return this.itemsService.updateItemType(+id, type);
  }




  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.itemsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
  //   return this.itemsService.update(+id, updateItemDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.itemsService.remove(+id);
  // }
}

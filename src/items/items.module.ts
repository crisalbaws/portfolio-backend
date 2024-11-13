import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../common/token.service';
import { CommonService } from '../common/common.service';
import { ItemEntity } from './entities/item.entity';
import { User } from '../users/user.entity';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, TokenService, CommonService],
  imports: [TypeOrmModule.forFeature([ItemEntity, User])],
})
export class ItemsModule { }

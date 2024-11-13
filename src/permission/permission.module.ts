import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { CommonService } from '../common/common.service';
import { TokenService } from '../common/token.service';

@Module({
  controllers: [PermissionController],
  providers: [CommonService, PermissionService, TokenService],
  imports: [UsersModule, TypeOrmModule.forFeature([Permission, User])],

})
export class PermissionModule {}

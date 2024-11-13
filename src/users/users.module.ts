import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from '../profiles/profile.entity';
import { ProfilesModule } from '../profiles/profiles.module';
import { TokenService } from '../common/token.service';
import { CommonService } from '../common/common.service';

@Module({
  controllers: [UsersController],
  providers: [CommonService, UsersService, TokenService],
  imports:[ProfilesModule, TypeOrmModule.forFeature([User, Profile ])]
})
export class UsersModule {}

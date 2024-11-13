import { Module, forwardRef } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Permission } from '../permission/entities/permission.entity';
import { TokenService } from '../common/token.service';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { CommonService } from '../common/common.service';

@Module({
    controllers: [ProfilesController],
    providers: [CommonService, ProfilesService, TokenService],
    imports: [forwardRef(() => UsersModule), ProfilesModule, TypeOrmModule.forFeature([Profile, Permission, User])],
    exports: [ProfilesService]
})
export class ProfilesModule { }

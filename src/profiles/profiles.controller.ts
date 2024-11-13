import { ApiResponse } from '../common/response.interface';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@Controller('api/profiles')
@ApiTags('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
    constructor(
        private profilesService: ProfilesService
    ) { }

    @Get()
    getProfiles(): Promise<ApiResponse> {
        return this.profilesService.getProfiles();
    }
    @Get(':id')
    getProfileById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse> {
        return this.profilesService.getProfileById(id);
    }

    @Post()
    createProfile(@Request() req: any, @Body() profile: CreateProfileDto): Promise<ApiResponse> {
        return this.profilesService.createProfile(profile);
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() profile: UpdateProfileDto): Promise<ApiResponse> {
        return this.profilesService.updateProfile(id, profile);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse> {
        return this.profilesService.deleteProfile(id);
    }

}


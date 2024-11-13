import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '../common/response.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenService } from '../common/token.service';

@Controller('api/users')
@ApiTags('users')
export class UsersController {

    constructor(
        private usersService: UsersService,
        private tknServ: TokenService
    ) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    getUsers(): Promise<ApiResponse> {
        return this.usersService.getUsers();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    getUserById(@Param('id') id: string): Promise<ApiResponse> {
        return this.usersService.getUserById(id);
    }

    @Post()
    createUser(@Body() user: CreateUserDto): Promise<ApiResponse> {
        return this.usersService.createUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    updateUser(@Request() req: any, @Param('id') id: string, @Body() user: UpdateUserDto): Promise<ApiResponse> {
        const userUpdateId = this.tknServ.userId(req);
        return this.usersService.updateUser(id, user, userUpdateId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    deleteUser(@Request() req: any, @Param('id') id: string): Promise<ApiResponse> {
        const userUpdateId = this.tknServ.userId(req);
        return this.usersService.deleteUser(id, userUpdateId);
    }

}

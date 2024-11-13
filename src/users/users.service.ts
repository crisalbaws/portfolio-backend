import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ApiResponse } from '../common/response.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { UsersListViewDto } from './dtos/users-list-view.dto';
import { plainToClass } from 'class-transformer';
import { hash } from 'bcryptjs'
import { UserDetailDto } from './dtos/user-detail.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private profilesService: ProfilesService,
        private commonService: CommonService,
    ) { }

    async getUsers(): Promise<ApiResponse> {
        try {
            const users = await this.usersRepository.find();
            let newArray: UsersListViewDto[] = plainToClass(UsersListViewDto, users);
            return this.commonService.processResponse(newArray);

        } catch (error) {
            return this.commonService.processResponse([], HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async createUser(user: CreateUserDto): Promise<ApiResponse> {
        try {
            const existingUser = await this.usersRepository.findOne({
                where: [
                    { phoneNumber: user.phoneNumber },
                    { email: user.email }
                ],
                relations: ["address"],
            });

            if (!existingUser) {
                const profile = await this.profilesService.getProfileById(user.profileId);
                if (profile && profile.data) {

                    user.userProfile = profile.data;
                    user.completeName = this.getNameComplete(user);
                    user.password = await hash(user.password, 10);

                    // Crear usuario
                    const newUser = this.usersRepository.create(user);
                    const savedUser = await this.usersRepository.save(newUser);

                    await this.usersRepository.save(savedUser);

                    return this.commonService.processResponse(savedUser, HttpStatus.CREATED, "Usuario creado correctamente");
                } else {
                    return this.commonService.processResponse(null, HttpStatus.CONFLICT, "El perfil no existe");
                }
            }

            return this.commonService.processResponse(null, HttpStatus.CONFLICT, "Ya existe un usuario con el correo o número telefónico ingresado, consulte al administrador: " + user.email);
        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor: " + error.message);
        }
    }

    async updateUser(id: string, user: UpdateUserDto, userUpdateId: number): Promise<ApiResponse> {
        try {
            const findUser = await this.usersRepository.findOne(
                {
                    where: {
                        id
                    },
                    relations: ["userProfile"],
                },
            );
            const findUserEmail = await this.usersRepository.findOne(
                {
                    where: {
                        email: user.email
                    }
                }
            );

            if (findUser && (!findUserEmail || (user.email == findUser.email))) {
                const findProfile = await this.profilesService.getProfileById(user.profileId);
                if (findProfile && findProfile.data) {
                    user.completeName = this.getNameComplete(user);
                    user.userProfile = findProfile.data;
                    user.password = await hash(user.password, 10);
                    const newUser = Object.assign(findUser, user);
                    newUser.updateDate = new Date();
                    // newUser.userUpdateId = userUpdateId;
                    this.usersRepository.save(newUser);
                    return this.commonService.processResponse(newUser, HttpStatus.OK, "Usuario actualizado correctamente");
                }
                else {
                    return this.commonService.processResponse(null, HttpStatus.CONFLICT, "El perfil no existe");
                }
            }
            else {
                if (!findUser) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El usuario no existe")
                else return this.commonService.processResponse(null, HttpStatus.CONFLICT, "El correo " + user.email + " ya esta en uso");
            }

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async deleteUser(id: string, userUpdateId: number): Promise<ApiResponse> {
        try {
            const findUser = await this.usersRepository.findOne(
                {
                    where: {
                        id
                    }
                }
            );

            if (findUser) {
                findUser.status = "Deleted";
                findUser.updateDate = new Date();
                // findUser.userUpdateId = userUpdateId;
                this.usersRepository.save(findUser);
                return this.commonService.processResponse(findUser, HttpStatus.OK, "Usuario eliminado correctamente");
            }
            return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El usuario no existe")

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async getUserById(id: string): Promise<ApiResponse> {
        try {
            const findUser = await this.usersRepository.findOne(
                {
                    where: {
                        id
                    },
                    relations: ["userProfile", "userProfile.permissions"]
                }
            );

            let newUser: UserDetailDto = plainToClass(UserDetailDto, findUser);
            if (findUser) return this.commonService.processResponse(newUser, HttpStatus.OK, "Correcto");
            return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El usuario no existe");

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async getCustomerByPhoneNumber(phoneNumber: string): Promise<ApiResponse> {
        try {
            const findUser = await this.usersRepository.findOne(
                {
                    where: {
                        phoneNumber
                    },
                    relations: ["userProfile", "userProfile.permissions"]
                }
            );

            let newUser: UserDetailDto = plainToClass(UserDetailDto, findUser);
            if (newUser.userProfile.name != 'Customer') {
                return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "No se encontro el usuario")
            }
            if (findUser) return this.commonService.processResponse(newUser, HttpStatus.OK, "Correcto");
            return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El usuario no existe");

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    getNameComplete(body: CreateUserDto | UpdateUserDto): string {
        const nameS = body.firstName ? body.firstName : "";
        const lastNameS = body.lastName ? (" " + body.lastName) : "";
        const secondLastNameS = body.secondLastName ? (" " + body.secondLastName) : "";
        return nameS + lastNameS + secondLastNameS;
    }
}

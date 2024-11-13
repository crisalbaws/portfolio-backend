import { HttpStatus, Injectable } from '@nestjs/common';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from '../common/response.interface';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Permission } from '../permission/entities/permission.entity';
import { CommonService } from '../common/common.service';

@Injectable()
export class ProfilesService {

    constructor(
        @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
        @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
        private commonService: CommonService
    ) { }

    async getProfiles(): Promise<ApiResponse> {
        try {
            const profiles = await this.profilesRepository.find({ relations: ['permissions'] });
            return this.commonService.processResponse(profiles)

        } catch (error) {
            return this.commonService.processResponse([], HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async createProfile(profile: CreateProfileDto): Promise<ApiResponse> {
        try {
            const findProfile = await this.profilesRepository.findOne(
                {
                    where: {
                        name: profile.name
                    }
                }
            );
            if (!findProfile) {
                const newProfile = this.profilesRepository.create(profile);
                newProfile.createDate = new Date();

                const permissionsPromises = profile.permissionIds.map(async (permissionId) => {
                    const findPermission = await this.permissionRepository.findOne({
                        where: {
                            id: permissionId
                        }
                    });
                    return findPermission;
                });

                const permissionsList = await Promise.all(permissionsPromises);

                newProfile.permissions = permissionsList.filter(permission => permission);

                this.profilesRepository.save(newProfile);
                return this.commonService.processResponse(newProfile, HttpStatus.CREATED, "Perfil creado correctamente");
            }

            return this.commonService.processResponse(null, HttpStatus.CONFLICT, "Ya existe un perfil con el nombre " + profile.name);

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async updateProfile(id: number, profile: UpdateProfileDto): Promise<ApiResponse> {
        try {
            const findProfile = await this.profilesRepository.findOne(
                {
                    where: {
                        id: id
                    },
                    relations: ['permissions']
                },
            );
            const findProfileName = await this.profilesRepository.findOne(
                {
                    where: {
                        name: profile.name
                    }
                }
            );

            if (findProfile && (!findProfileName || (profile.name == findProfile.name))) {
                findProfile.updateDate = new Date();
                const newProfile = Object.assign(findProfile, profile);
                newProfile.permissionIds = profile.permissionIds;
                let permissionsList: any[] = [];
                await newProfile.permissionIds.forEach(async permissionId => {
                    const findPermission = await this.permissionRepository.findOne(
                        {
                            where: {
                                id: permissionId
                            }
                        }
                    )
                    if (findPermission) permissionsList.push(findPermission);
                });
                newProfile.permissions = permissionsList;
                this.profilesRepository.save(newProfile);
                return this.commonService.processResponse(newProfile, HttpStatus.OK, "Perfil actualizado correctamente");
            }
            else {
                console.log("User")

                if (!findProfile) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El perfil no existe")
                else return this.commonService.processResponse(null, HttpStatus.CONFLICT, "El nombre " + profile.name + " ya esta en uso");
            }

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async deleteProfile(id: number): Promise<ApiResponse> {
        try {
            const findProfile = await this.profilesRepository.findOne(
                {
                    where: {
                        id: id
                    }
                }
            );

            if (findProfile) {
                findProfile.status = "Deleted";
                findProfile.updateDate = new Date();
                this.profilesRepository.save(findProfile);
                return this.commonService.processResponse(findProfile, HttpStatus.OK, "Perfil eliminado correctamente");
            }
            return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El perfil no existe")

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }

    async getProfileById(id: number): Promise<ApiResponse> {
        try {
            const findProfile = await this.profilesRepository.findOne(
                {
                    where: {
                        id: id
                    },
                    relations: ['permissions'],
                }
            );
            if (findProfile) return this.commonService.processResponse(findProfile, HttpStatus.OK, "Correcto");
            return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El perfil no existe");

        } catch (error) {
            return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor")
        }
    }
}


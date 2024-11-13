import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from '../common/response.interface';
import { CommonService } from '../common/common.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    private commonService: CommonService
  ) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<ApiResponse> {
    try {
      const newPermission = await this.permissionRepository.create(createPermissionDto);
      this.permissionRepository.save(newPermission);
      return this.commonService.processResponse(newPermission);
    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor:" + error.message);
    }
  }

  async findAll(): Promise<ApiResponse> {
    try {
      const findAll = await this.permissionRepository.find();
      return this.commonService.processResponse(findAll);
    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor:" + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const findPermission = await this.permissionRepository.findOne(
        {
          where: {
            id: id
          }
        }
      );
      if (findPermission) return this.commonService.processResponse(findPermission, HttpStatus.OK, "Correcto");
      return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El permiso no existe");

    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor:" + error.message);
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const findPermission = await this.permissionRepository.findOne(
        {
          where: {
            id: id
          }
        }
      );
      const findPermissionName = await this.permissionRepository.findOne(
        {
          where: {
            name: updatePermissionDto.name
          }
        }
      );

      if (findPermission && (!findPermissionName || (updatePermissionDto.name == findPermission.name))) {
        findPermission.updateDate = new Date();
        const updatePermission = Object.assign(findPermission, updatePermissionDto);
        this.permissionRepository.save(updatePermission);
        return this.commonService.processResponse(updatePermission, HttpStatus.OK, "Permiso actualizado correctamente");
      }
      else {
        console.log("User")

        if (!findPermission) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El perfil no existe")
        else return this.commonService.processResponse(null, HttpStatus.CONFLICT, "El nombre " + updatePermissionDto.name + " ya esta en uso");
      }

    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor: " + error.message)
    }
  }
}

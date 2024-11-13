import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, MaxLength } from "class-validator";
import { Permission } from "../../permission/entities/permission.entity";

export class CreateProfileDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    name: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    description?: string;

    @ApiProperty()
    permissions?: Permission[];

    @ApiProperty()
    status: string;

    @ApiProperty()
    @IsArray()
    permissionIds: number[]; // Nueva columna para almacenar IDs de permisos
    
}
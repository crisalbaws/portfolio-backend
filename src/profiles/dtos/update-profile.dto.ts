import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString, MaxLength } from "class-validator";
import { Permission } from "../../permission/entities/permission.entity";

export class UpdateProfileDto {
    @ApiProperty()
    @IsNumber()
    id: number;
    
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
    permissionIds: number[]; // Utiliza IDs de permisos aquí

}
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
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
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    code: string;
}

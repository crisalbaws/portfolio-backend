import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreatePermissionDto {
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

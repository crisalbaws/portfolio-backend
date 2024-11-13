import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, MaxLength, ValidateNested } from "class-validator";
import { Profile } from "../../profiles/profile.entity";
import { Type } from "class-transformer";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    firstName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    lastName?: string;
    
    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    secondLastName?: string;
    
    @IsString()
    completeName?: string;
    
    @ApiProperty()
    @IsString()
    status: string;
    
    userProfile?: Profile;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    @MaxLength(15, { message: 'Máximo 15 caracteres' })
    password: string;

    @ApiProperty()
    @IsNumber()
    profileId: number;
}
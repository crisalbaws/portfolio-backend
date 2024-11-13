import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNumber, IsString, MaxLength } from "class-validator";
import { Profile } from "../../profiles/profile.entity";

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    firstName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    lastName: string;
    
    @ApiProperty()
    @IsString()
    @MaxLength(50, { message: 'Máximo 50 caracteres' })
    secondLastName: string;
    
    @ApiProperty()
    @IsString()
    completeName?: string;
    
    @ApiProperty()
    @IsString()
    status: string;
    
    userProfile?: Profile;

    // @ApiProperty()
    // @IsPhoneNumber()
    // @MaxLength(15, { message: 'Máximo 15 caracteres' })
    // phoneNumber: string;
    
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

    @ApiProperty()
    @IsDate()
    updateDate?: Date;

    @ApiProperty()
    @IsNumber()
    customerId?: Number;

    // @ApiProperty()
    // @IsNumber()
    // userUpdateId
}
import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateItemDto extends PartialType(CreateItemDto) {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    userUpdateName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    userUpdateId?: string;

    @IsDate()
    updateDate?: Date;


    @ApiProperty()
    @IsNumber()
    idProviderUpdated: number;
}

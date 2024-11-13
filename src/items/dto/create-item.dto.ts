import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ItemCategory, ItemStatus, ItemType } from "../items-enums";

export class CreateItemDto {
    @ApiProperty({ enum: ItemCategory })
    @IsEnum(ItemCategory)
    category: ItemCategory;

    @ApiProperty({ enum: ItemStatus })
    @IsEnum(ItemStatus)
    status: ItemStatus;

    @ApiProperty({ enum: ItemType })
    @IsEnum(ItemType)
    type: ItemType;

    @IsDate()
    creationDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    userCreationName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userCreationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    measures?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty()
    @IsNumber()
    idProviderCreated: number;
}

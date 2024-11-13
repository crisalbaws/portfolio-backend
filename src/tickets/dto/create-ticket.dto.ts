import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Column } from "typeorm";
import { CreateCommentDto } from "./create-comment.dto";
import { TicketStatus, TicketType } from "../tickets-enums";
import { Type } from "class-transformer";
import { CreateTicketItemDto } from "../../ticket-items/dto/create-ticket-item.dto";

export class TicketCreateRequestDto {
    @ApiProperty()
    folio?: string;

    @ApiProperty({ enum: TicketStatus })
    @IsEnum(TicketStatus)
    status: TicketStatus;

    @ApiProperty({ enum: TicketType })
    @IsEnum(TicketType)
    ticketType: TicketType;

    @ApiProperty()
    @IsNotEmpty()
    category: string;

    @ApiProperty()
    @IsNotEmpty()
    idCategory: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    creationDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    userCreationName: string;

    @ApiProperty()
    @IsOptional()
    userCreationId: string;

    @ApiProperty()
    @IsNotEmpty()
    userUpdateId: string;

    @ApiProperty()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty()
    @IsNotEmpty()
    customerName: string;

    @ApiProperty()
    @IsNotEmpty()
    channel: string;

    @ApiProperty()
    comments: CreateCommentDto[];

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTicketItemDto)
    @IsOptional()
    items: CreateTicketItemDto[];

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    idProvider?: number;
}
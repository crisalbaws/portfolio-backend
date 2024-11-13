import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ItemEntity } from "../../items/entities/item.entity";
import { TicketEntity } from "../../tickets/entities/ticket.entity";
import { TicketItemStatus } from "../ticket-items-enums";

export class CreateTicketItemDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;

    ticket: TicketEntity;

    item: ItemEntity;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    itemName: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    itemPrice: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ enum: TicketItemStatus })
    @IsEnum(TicketItemStatus)
    status: TicketItemStatus;
}

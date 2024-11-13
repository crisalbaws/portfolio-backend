import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Column } from "typeorm";
import { TicketStatus } from "../tickets-enums";
import { CreateTicketItemDto } from "../../ticket-items/dto/create-ticket-item.dto";
import { Type } from "class-transformer";

export class TicketCloseRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ enum: TicketStatus })
    @IsEnum(TicketStatus)
    status: TicketStatus;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    upadeDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    userUpdateId: string;

    @ApiProperty()
    @IsNotEmpty()
    userUpdateName: string;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTicketItemDto)
    itemsToDelete: CreateTicketItemDto[];

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTicketItemDto)
    itemsToAdd: CreateTicketItemDto[];


    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;
}


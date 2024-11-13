import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, ValidateNested } from "class-validator";
import { Column } from "typeorm";
import { UpdateAttachmentDto } from "./update-attachments.dto";
import { Type } from "class-transformer";

export class UpdateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    userIdCreated: string;

    @ApiProperty()
    @IsNotEmpty()
    userNameCreated: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    createDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    comment: string;

    @ApiProperty({ type: [UpdateAttachmentDto], nullable: true })
    @ValidateNested({ each: true })
    @Type(() => UpdateAttachmentDto)
    attachments?: UpdateAttachmentDto[];
}
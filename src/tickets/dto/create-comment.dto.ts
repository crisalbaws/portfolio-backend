import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateAttachmentDto } from "./create-attachments.dto";
import { Type } from "class-transformer";

export class CreateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    id: number;
  
    @ApiProperty()
    @IsNotEmpty()
    userIdCreated: string;
  
    @ApiProperty()
    @IsNotEmpty()
    userNameCreated: string;
  
    @ApiProperty()
    @IsNotEmpty()
    comment: string;
  
    @ApiProperty({ type: [CreateAttachmentDto], nullable: true })
    @ValidateNested({ each: true })
    @Type(() => CreateAttachmentDto)
    attachments?: CreateAttachmentDto[];
  }
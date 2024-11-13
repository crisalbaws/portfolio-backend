import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAttachmentDto {

  @ApiProperty()
  @IsString()
  uri: string;

  @ApiProperty()
  @IsString()
  name: string;
}
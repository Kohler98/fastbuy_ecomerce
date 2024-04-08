import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        example:"Belleza",
        description: 'Title (unique)',
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    title: string;
}

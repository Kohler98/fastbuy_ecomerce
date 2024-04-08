import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, IsUUID, MinLength 
} from 'class-validator';


export class CreateProductDto {

    @ApiProperty({
        example:"Product",
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example:"99",
        description: 'Price Float Number',
        nullable: false,
    })
    @IsNumber()
    @IsPositive()
    @IsString()
    price: string;

    @ApiProperty({
        example:"name@emai.com",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example:"http://image.png",
        description: 'Url Image',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({
        example:"1574ae09-790b-4766-b849-f5f821e375a7",
        description: 'UUID',
        nullable: false,
    })
    @IsUUID()
    categoryId: string;

}
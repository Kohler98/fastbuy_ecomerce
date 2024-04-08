import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { OrderItems } from "../interfaces/orderItems.interface";
import { OrderStatus } from "../interfaces/orderStatus.enum";
import { Type } from 'class-transformer';
import { ShippingInfo } from "../interfaces/shipinInfo.interfaces";
import { ApiProperty } from "@nestjs/swagger";


export class CreateOrderDto {

    @ApiProperty({
        example:"shoppingInfo:{fullname: string, city: string, address: string}",
        description: 'Object',
        nullable: false,
    })
    @ValidateNested({ each: true })
    @Type(() => ShippingInfo)
    shippingInfo: ShippingInfo;

    @ApiProperty({
        example:"shoppingInfo:[{ title: string, price: number, image: string, quantity: number, productId: string}]",
        description: 'Array of products',
        nullable: false,
    })
    @ValidateNested({ each: true })
    @Type(() => OrderItems)
    orderItems: OrderItems[];

    @ApiProperty({
        example:"200",
        description: 'Sum of orderItems',
        nullable: false,
    })
    @IsNumber()
    @IsPositive()
    totalPrice: number;

    @ApiProperty({
        example:"true",
        description: 'Boolean, default: false',
        nullable: true,
    })
    @IsBoolean()
    @IsOptional()
    paid?: boolean;

    @ApiProperty({
        example:"DD/MM/AA",
        description: '23/02/2023',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    delivered_at?: string;

    @ApiProperty({
        example:"OrderStatus.DELIVERED",
        description: 'Enum',
        nullable: true,
    })
    @IsEnum(OrderStatus)
    @IsOptional()
    orderStatus?: OrderStatus;
    
}

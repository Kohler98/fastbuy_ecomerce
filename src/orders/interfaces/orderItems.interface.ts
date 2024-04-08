import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class OrderItems{
    @IsString()
    title: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    image: string;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsUUID()
    productId: string;
}
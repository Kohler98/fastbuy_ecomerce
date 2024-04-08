import { IsNotEmpty, IsString } from "class-validator";

export class ShippingInfo {
    @IsString()
    @IsNotEmpty()
    fullname: string;
    @IsString()
    @IsNotEmpty()
    city: string;
    @IsString()
    @IsNotEmpty()
    address: string
}
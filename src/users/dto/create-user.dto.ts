import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {

    @ApiProperty({
        example:"name@emai.com",
        description: 'Email (unique)',
        nullable: false,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example:"Root09",
        description: 'Password Min 6 character a Uppercase, Lowercase letter and number',
        nullable: false,
        minLength: 6,
        maxLength: 50,
        
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}

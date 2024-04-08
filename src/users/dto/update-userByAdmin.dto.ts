
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";
import { User } from "../entities/user.entity";
import { Roles } from "../enum/roles.enum";


export class UpdateUserByAdminDto extends PartialType(OmitType(User, ['email', 'password'])) {

  @ApiProperty({
    description: 'Id (unique)',
    nullable: false,
    minLength: 1
})
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Roles',
    nullable: true,
    enumName: "Roles"
  })
  @IsArray()
  @IsOptional()
  roles?: Roles[];

  @ApiProperty({
    description: 'User isActive',
    nullable: false,
    default: true
  })  
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
 
}
import { Controller, Get, Post, Body, Patch, Param, Query, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Roles } from './enum/roles.enum';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { UpdateUserByAdminDto } from './dto/update-userByAdmin.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User was created', type: User  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  };

  @Post('login')
  @ApiResponse({ status: 200, description: 'successfully authenticated User', type: User  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.login(createUserDto);
  };

  @Post('block-user/:id')
  @Auth(Roles.SUPER_ADMIN, Roles.MANAGER)
  async blockUser(
    @Param('id', ParseUUIDPipe ) id: string, 
    @GetUser() user: User,
  ) {
    return await this.usersService.block(id, user)
  };

  @Put(':id')
  @Auth()
  async update( 
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return await this.usersService.update(id, updateUserDto, user);
  };

  @Patch('update-user-by-admin')
  @Auth(Roles.SUPER_ADMIN, Roles.MANAGER)
  async updatUserByAdmin(
    @Body() updateUserByAdminDto: UpdateUserByAdminDto,
    @GetUser() user: User,
  ){
    return await this.usersService.adminUpdate(updateUserByAdminDto.id, updateUserByAdminDto, user )
  };

  @Get('check-status')
  @Auth(Roles.SUPER_ADMIN, Roles.MANAGER)
  async checkAuthStatus(
    @GetUser() user: User
  ) {
    return await this.usersService.checkAuthStatus( user );
  };

  @Get()
  @Auth(Roles.SUPER_ADMIN, Roles.MANAGER)
  async findAll(
    @GetUser() user: User,
    @Query() paginationDto: PaginationDto
  ) {
    
    return await this.usersService.findAll(paginationDto);
  };

  @Get(':id')
  @Auth()
  async findOne( @Param('id', ParseUUIDPipe ) id: string) {
    return await this.usersService.findOne(id);
  };

  @Post('count')
  @Auth(Roles.SUPER_ADMIN, Roles.MANAGER)
  async countUsers() {

    return await this.usersService.countUsers();
  };
  
}

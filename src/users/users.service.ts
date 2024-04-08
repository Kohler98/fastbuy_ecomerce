import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException,
  NotFoundException, 
  UnauthorizedException, 
  Logger 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthUserDto } from './dto/auth-user.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { Roles } from './enum/roles.enum';
import { UpdateUserByAdminDto } from './dto/update-userByAdmin.dto';

@Injectable()
export class UsersService {

  private logger = new Logger('UserService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}


// SERVICES FOR USER --------------------------------//
 async create( createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save( user )
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handlerDBError(error);
    };

  };

  async login( loginUserDto: AuthUserDto ) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  };

  async update( id: string, updateUserDto: UpdateUserDto, ownerUser: User) {

    try {
     const user = await this.userRepository.preload({
       ...updateUserDto,
        password: bcrypt.hashSync(updateUserDto.password, 10),
       id
     });
 
 
     if(ownerUser.id !== user.id){
       throw new NotFoundException('No puedes modificar este recurso');
     };
 
     user.lastUpdateByUser = ownerUser;
 
     return await this.userRepository.save(user);
 
    } catch (error) {
 
     this.handlerDBError(error);
 
    };
 
  };

// SERVICES FOR ADMINS --------------------------------//

  async checkAuthStatus( user: User ){

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  };

  

  async findAll(paginationDto: PaginationDto) {

    const {limit, offset} = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      //relations: {
        //images: true,
      //}
    })

    return users;
  };


  async findOne(id: string): Promise<User> {

    try {

     return await this.userRepository.findOneByOrFail({id});

    } catch (error) {

     throw new NotFoundException('El id no existe');
    };

   };

   async adminUpdate(id: string, updateUserByAdminDto: UpdateUserByAdminDto, adminUser: User){

    try {

      const user = await this.userRepository.preload({ 
        ...updateUserByAdminDto,
        id
      });

      user.lastUpdateByUser = adminUser;

      return await this.userRepository.save(user);

    } catch (error) {
      this.handlerDBError(error);
    }
  };


  async block(id: string, adminUser: User): Promise<User> {
    const userBlock = await this.findOne(id);

    userBlock.isActive = false;
    userBlock.lastUpdateByUser = adminUser;

    return await this.userRepository.save(userBlock);
  };

  async countUsers() {
    try {
      return await this.userRepository.count({})
    } catch (error) {
      console.log(error)
    }
  };

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;

  }

  private handlerDBError(error: any): never {
    if(error.code === '23505'){
      throw new BadRequestException(error.detail.replace('Key ', ''))
    }

    if(error.code === 'error-001'){
      throw new BadRequestException(error.detail.replace('Key ', ''))
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs')
  };
}

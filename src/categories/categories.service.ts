import { Injectable } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {

  private logger = new Logger('CategoriesService')

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ){};

  async create(createCategoryDto: CreateCategoryDto) {

    const {title} = createCategoryDto;
    
    try {
      const category = this.categoryRepository.create({ title: title.toLocaleLowerCase()})

      return await this.categoryRepository.save(category)
    } catch (error) {
      this.handlerDBError(error)
    }
  };

  async findAll(paginationDto: PaginationDto) {
    const {limit, offset} = paginationDto;
    try {
      const categories = await this.categoryRepository.find({
        take: limit,
        skip: offset,
        relations: {
          products: true
        }
      })

      return categories;


    } catch (error) {
      this.handlerDBError(error)
    }
  };

  async findOne(id: string) {
    try {

      return await this.categoryRepository.findOneByOrFail({id});
 
     } catch (error) {
 
      throw new NotFoundException('El id no existe');
     };
  };

  async update(id: string, updateCategoryDto: UpdateCategoryDto, adminUser: User) {
    try {

      const category = await this.categoryRepository.preload({ 
        ...updateCategoryDto,
        id
      });

      category.lastUpdateByUser = adminUser;

      return await this.categoryRepository.save(category);

    } catch (error) {
      this.handlerDBError(error);
    }
  };

  async remove(id: string): Promise<Category> {
    const category = await this.findOne(id)

    return await this.categoryRepository.remove({...category, id})
  };

  private handlerDBError(error: any): never {
   

    if(error){
      throw new BadRequestException(error.detail.replace('Key ', ''))
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs')
  };
}

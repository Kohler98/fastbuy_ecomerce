import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


import { validate as isUUID } from 'uuid';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,

  ) {}



  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {

    if ( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    try {
      const {  categoryId, image,  ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        title: productDetails.title.toLocaleLowerCase(),
        price: parseFloat(productDetails.price),
        image: secureUrl,
        category: {id: categoryId}
      });
      
      await this.productRepository.save( product );

      return { ...product };
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  };

  async update( id: string, updateProductDto: UpdateProductDto, file: Express.Multer.File ) {

    if ( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    try {
      const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;


      const { price, categoryId, ...toUpdate } = updateProductDto;


      const product = await this.productRepository.preload({ 
        id, 
        ...toUpdate,
        title: toUpdate.title.toLocaleLowerCase(),
        price: parseFloat(price),
        image: secureUrl,
        category: {id: categoryId}
      });

      await this.productRepository.save( product );

      return { ...product };
    } catch (error) {
      this.handleDBExceptions(error);
    } 
  };

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.productRepository.remove( product );
    
  };
  
  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      //relations: {
        //category: true,
      //}
    })

    return products;
  };

  async findOne( id: string ) {

    try {

      return await this.productRepository.findOneByOrFail({id});
 
     } catch (error) {
 
      throw new NotFoundException('El id no existe');
     };
  }

  async findOnePlain( term: string ) {
    const { ...rest } = await this.findOne( term );
    return {
      ...rest,
    }
  }


  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

}

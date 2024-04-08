import { Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UploadedFile, 
  ParseUUIDPipe, 
  UseInterceptors  
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/users/decorators/auth.decorator';
import { Roles } from 'src/users/enum/roles.enum';
import { Product } from './entities/product.entity';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create-product')
  @ApiResponse({ status: 201, description: 'Product was created', type: Product  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(Roles.MANAGER, Roles.SUPER_ADMIN, Roles.EDITOR)
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  };

  @Get('/')
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.productsService.findAll( paginationDto );
  };

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  };

  @Patch(':id')
  @Auth(  Roles.MANAGER, Roles.SUPER_ADMIN, Roles.EDITOR )
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  update(
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.update( id, updateProductDto, file);
  };

  @Delete(':id')
  @Auth( Roles.MANAGER, Roles.SUPER_ADMIN, Roles.EDITOR)
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.productsService.remove( id );
  };
};

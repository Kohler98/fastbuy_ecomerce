import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Product } from './entities/product.entity';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    TypeOrmModule.forFeature([ Product ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [ TypeOrmModule, PassportModule ]
})

export class ProductsModule {}

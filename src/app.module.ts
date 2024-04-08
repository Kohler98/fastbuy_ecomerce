import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CommonModule } from './common/common.module';
import { CategoriesModule } from './categories/categories.module';
import { join } from 'path';

@Module({
  imports: [

    ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),

    CommonModule, 
    UsersModule, 
    ProductsModule, 
    OrdersModule, 
    CategoriesModule, 

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

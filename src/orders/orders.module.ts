import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Order } from './entities/order.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports:[
    TypeOrmModule.forFeature([ Order ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ]
})
export class OrdersModule {}

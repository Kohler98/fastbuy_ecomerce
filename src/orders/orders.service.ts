import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {


  private logger = new Logger('OrderService')

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ){};

  async create(createOrderDto: CreateOrderDto, client: User) {

  
    try {
      const order = this.orderRepository.create(createOrderDto)

      order.user = client;

      return await this.orderRepository.save(order)

    } catch (error) {

      this.handlerDBError(error)
    }
  };

  async findAll(paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0 } = paginationDto;
    const orders = await this.orderRepository.find({
      take: limit,
      skip: offset,
      relations: {
        user: true,
      }
    })

    const totalOrders = await this.orderRepository.count()

    return {
      data: orders,
      count: totalOrders
    }
  };

  async findOne(id: string) {
    try {

      return await this.orderRepository.findOneByOrFail({id});
 
     } catch (error) {
 
      throw new NotFoundException('El id no existe');
     };
  };

  async getMyOrders(user: User){
    try {
      const orders = await this.orderRepository.find({
        relations:{
          user: true
        },
        where:{
          user: {id: user.id}
        }
      })
  
      if(!orders){
        throw new NotFoundException('No tienes ordenes')
      }
  
      return orders
    } catch (error) {
      this.handlerDBError(error)
    }
  };

  async update(id: string, updateOrderDto: UpdateOrderDto, user: User) {

    const updateOrder = await this.orderRepository.preload({
      ...updateOrderDto,
      id
    })

    updateOrder.lastUpdateByUser = user

    return this.orderRepository.save(updateOrder);
  };

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private handlerDBError(error: any): never {
   

    if(error){
      throw new BadRequestException(error.detail.replace('Key ', ''))
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs')
  };
}

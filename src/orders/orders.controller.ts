import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { Auth } from 'src/users/decorators/auth.decorator';
import { Roles } from 'src/users/enum/roles.enum';
import { GetUser } from 'src/users/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('new-order')
  @ApiResponse({ status: 201, description: 'Order was created', type: Order  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Auth()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User
    ) {
    return await this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @Auth(Roles.MANAGER, Roles.SUPER_ADMIN)
  async findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return await this.ordersService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(Roles.MANAGER, Roles.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  @Post('my-orders')
  @Auth()
  async myOrders(
    @GetUser() user: User
  ){
    return await this.ordersService.getMyOrders(user)
  }

  @Patch(':id')
  @Auth(Roles.MANAGER, Roles.SUPER_ADMIN)
  update(
    @Param('id') id: string, 
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: User
    ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}

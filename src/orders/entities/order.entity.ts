import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderItems } from "../interfaces/orderItems.interface";
import { OrderStatus } from "../interfaces/orderStatus.enum";
import { ShippingInfo } from "../interfaces/shipinInfo.interfaces";


@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('simple-json')
    shippingInfo: ShippingInfo;

    @Column('simple-json')
    orderItems: OrderItems[];

    @Column('float')
    totalPrice: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PROCESSING,
    })
    orderStatus: OrderStatus;

    @Column('boolean', {default: false})
    paid: boolean;

    @Column('text', {nullable: true})
    delivered_at?: string;

    @Column({type: 'timestamp', default: () => 'now()'})
    created_at: string;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @ManyToOne(() => User, (user) => user.lastUpdateByUser, {nullable: true, lazy: true})
    @JoinColumn({name: 'lastUpdateByUser' })
    lastUpdateByUser?: User;
}

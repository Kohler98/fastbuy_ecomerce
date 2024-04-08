import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {

    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id: string;
    
    @Column({type: 'text', unique: true})
    @IsString()
    @IsNotEmpty()
    title: string;

    @ManyToOne(() => User, (user) => user.lastUpdateByUser, {nullable: true, lazy: true})
    @JoinColumn({name: 'lastUpdateByUser' })
    lastUpdateByUser?: User;

    @OneToMany(() => Product, (product) => product.category, {  eager: true})
    products: Product[];
}

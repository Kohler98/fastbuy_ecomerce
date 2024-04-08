import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Lavansan',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column({type:'text'})
    title: string;

    @ApiProperty({
        example: 'Anim reprehenderit nulla in anim mollit minim irure commodo.',
        description: 'Product description',
        default: null,
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
    })
    @Column('float', { default: 0 })
    price: number;

    @Column({ type: 'text', nullable: true })
    image: string;

    @ManyToOne(() => Category, (category) => category.products, {lazy: true})
    category: Category;

    @Column({type: 'timestamp', default: () => 'now()'})
    created_at: string;
}

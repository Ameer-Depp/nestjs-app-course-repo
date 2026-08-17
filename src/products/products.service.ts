import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UsersService,
  ) {}

  async getAllProducts(
    title?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('reviews.user', 'reviewUser') // who wrote each review
      .select([
        'product',
        'user.id',
        'user.username',
        'reviews',
        'reviewUser.id',
        'reviewUser.username',
      ]);

    if (title) {
      query.andWhere('product.title ILIKE :title', { title: `%${title}%` });
    }

    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    return query.getMany();
  }

  async createNewProduct(
    body: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const user = await this.userService.getCurrentUser(userId);
    const product = this.productRepository.create({
      ...body,
      title: body.title.toLocaleLowerCase(),
      user,
    });
    return this.productRepository.save(product);
  }

  async getOneProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async updateProduct(id: number, body: UpdateProductDto): Promise<Product> {
    // .preload() maps the incoming data to the entity, finding it by ID first.
    // It returns undefined if the entity with the given ID does not exist.
    const product = await this.productRepository.preload({
      id,
      ...body,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    // .delete() is faster than .remove() as it doesn't require fetching the entity first
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}

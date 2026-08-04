import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async createNewProduct(body: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(body);
    return this.productRepository.save(product);
  }

  async getOneProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

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

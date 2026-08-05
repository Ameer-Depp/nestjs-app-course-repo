import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  public async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Post()
  public async createNewProduct(
    @Body() body: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createNewProduct(body);
  }

  @Get(':id')
  public async getOneProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.getOneProduct(id);
  }

  @Put(':id')
  public async updateProduct(
    @Param('id') id: number, // Ensured ParseIntPipe is used here
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 is the standard success code for DELETE without a response body
  public async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}

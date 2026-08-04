import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller({})
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get('/api/products')
  public getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post('/api/products')
  public createNewProduct(@Body() body: CreateProductDto) {
    return this.productService.createNewProduct(body);
  }

  @Get('/api/products/:id')
  public getOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getOneProduct(id);
  }

  @Put('/api/products/:id')
  public updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, body);
  }
}

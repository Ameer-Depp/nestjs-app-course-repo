import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

type ProductType = { id: number; title: string; price: number };

@Controller({})
export class ProductsController {
  private products: ProductType[] = [
    { id: 1, title: 'laptop', price: 323 },
    { id: 2, title: 'phone', price: 1000 },
  ];
  @Get('/api/products')
  public getAllProducts() {
    return this.products;
  }

  @Post('/api/products')
  public createNewProduct(@Body() body: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  @Get('/api/products/:id')
  public getOneProduct(@Param('id', ParseIntPipe) id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('product not found');
    return product;
  }

  @Put('/api/products/:id')
  public updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');

    // const updatedProduct: ProductType = {
    //   title: body.title,
    //   price: body.price,
  }
}

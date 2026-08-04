import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

type ProductType = { id: number; title: string; price: number };

@Injectable()
export class ProductsService {
  private products: ProductType[] = [
    { id: 1, title: 'laptop', price: 323 },
    { id: 2, title: 'phone', price: 1000 },
  ];

  public getAllProducts() {
    return this.products;
  }

  public createNewProduct(body: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  public getOneProduct(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('product not found');
    return product;
  }

  public updateProduct(id: string, body: UpdateProductDto) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException('product not found');

    // const updatedProduct: ProductType = {
    //   title: body.title,
    //   price: body.price,
  }
}

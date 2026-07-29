import { Controller } from '@nestjs/common';

@Controller({})
export class ProductsController {
  public getAllProducts() {
    return [
      { name: 'ameer', age: 20, online: true },
      { name: 'raul', age: 21, online: false },
      { name: 'jena', age: 21, online: true },
    ];
  }
}

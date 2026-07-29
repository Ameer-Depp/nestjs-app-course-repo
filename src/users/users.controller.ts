import { Controller, Get } from '@nestjs/common';

@Controller({})
export class UsersController {
  @Get('/api/users')
  public getAllUsers() {
    return [
      { name: 'ameer', age: 20, online: true },
      { name: 'raul', age: 21, online: false },
      { name: 'jena', age: 21, online: true },
    ];
  }
}

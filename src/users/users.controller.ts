import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReviewsService } from '../reviews/reviews.service';

@Controller({})
export class UsersController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly userService: UsersService,
  ) {}
  @Get('/api/users')
  public getAllUsers() {
    return [
      { name: 'ameer', age: 20, online: true },
      { name: 'raul', age: 21, online: false },
      { name: 'jena', age: 21, online: true },
    ];
  }
}

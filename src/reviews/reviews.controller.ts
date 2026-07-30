import { Controller, Get } from '@nestjs/common';

@Controller({})
export class ReviewsController {
  @Get('/api/reviews')
  public getAllReviews() {
    return [
      { id: 1, review: 3, comment: 'very good' },
      { id: 2, review: 4, comment: ' good' },
    ];
  }
}

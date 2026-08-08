import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller({})
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get('/api/reviews')
  public getAllReviews() {
    return [
      { id: 1, review: 3, comment: 'very good' },
      { id: 2, review: 4, comment: ' good' },
    ];
  }
}

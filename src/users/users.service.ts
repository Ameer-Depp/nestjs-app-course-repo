import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewService = ReviewsService,
  ) {}
}

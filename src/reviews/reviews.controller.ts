import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../../utils/enums';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import * as types from '../../utils/types';
import { CreateReviewDTO } from './dto/create-review.dto';
import { AuthGuard } from '../users/guards/auth.guard';
import { updateReviewDTO } from './dto/update-review.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/:id')
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public createReview(
    @Param('id') productId: number,
    @CurrentUser() payload: types.JWTPayloadType,
    @Body() body: CreateReviewDTO,
  ) {
    return this.reviewsService.createReview(productId, payload.id, body);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public getAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ) {
    return this.reviewsService.getAllReviews(pageNumber, reviewPerPage);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public getOneReview(@Param('id') reviewId: number) {
    return this.reviewsService.getOneReview(reviewId);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public updateReview(
    @Param('id') reviewId: number,
    @CurrentUser() payload: types.JWTPayloadType,
    @Body() body: updateReviewDTO,
  ) {
    return this.reviewsService.updateReview(reviewId, body, payload.id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN, UserType.USER)
  public deleteReview(
    @Param('id') reviewId: number,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.reviewsService.deleteReview(reviewId, payload);
  }
}

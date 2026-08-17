/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CreateReviewDTO } from './dto/create-review.dto';
import { updateReviewDTO } from './dto/update-review.dto';
import * as types from '../../utils/types';
import { UserType } from '../../utils/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductsService,
    private readonly userService: UsersService,
  ) {}

  public async createReview(
    productId: number,
    userId: number,
    dto: CreateReviewDTO,
  ) {
    const product = await this.productService.getOneProduct(productId);
    const user = await this.userService.getCurrentUser(userId);

    const review = this.reviewRepository.create({
      ...dto,
      user,
      product,
    });

    const result = await this.reviewRepository.save(review);

    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      userId: user.id,
      userName: user.username,
      productId: product.id,
      product: product.title,
    };
  }

  // get all reviews
  public async getAllReviews(pageNumber: number, numberPerPage: number) {
    const reviews = await this.reviewRepository.find({
      skip: numberPerPage * (pageNumber - 1),
      take: numberPerPage,
    });
    if (!reviews) throw new NotFoundException('No reviews found');

    return reviews;
  }

  // get single review by id
  public async getOneReview(reviewId: number) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('review not found ');

    return review;
  }

  // update review
  public async updateReview(
    reviewId: number,
    dto: updateReviewDTO,
    userId: number,
  ) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { user: true },
    });

    if (!review) throw new NotFoundException('review not found');

    if (review.user.id !== userId) {
      throw new ForbiddenException('you can only update your own comment');
    }

    const { rating, comment } = dto;

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    return this.reviewRepository.save(review);
  }

  // delete review
  public async deleteReview(
    reviewId: number,
    currentUser: types.JWTPayloadType,
  ) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: { user: true },
    });

    if (!review) throw new NotFoundException('review not found');

    const isOwner = review.user.id === currentUser.id;
    const isAdmin = currentUser.userType === UserType.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('you can only delete your own review');
    }

    await this.reviewRepository.remove(review);

    return { message: 'review deleted successfully' };
  }
}

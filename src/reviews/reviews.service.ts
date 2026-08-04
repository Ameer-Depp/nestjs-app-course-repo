import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService = UsersService,
  ) {}
}

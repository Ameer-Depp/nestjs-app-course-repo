import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from '../utils/middlewares/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: process.env.NODE_ENV !== 'production', // Disable in production
        entities: [Product, User, Review],
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 10, // 10 seconds
        limit: 3,
      },
    ]),

    ProductsModule,
    UsersModule,
    ReviewsModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

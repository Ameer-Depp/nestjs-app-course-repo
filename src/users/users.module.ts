/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { StringValue } from 'ms';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, JwtModule],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES_IN') as StringValue,
          },
        };
      },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/users',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 21432345)}`;
          const fileName = `${prefix}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('unsupported file format'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  ],
})
export class UsersModule {}

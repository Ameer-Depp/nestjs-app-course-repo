import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'title should be a string' })
  @IsNotEmpty({ message: 'title cannot be empty' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsString({ message: 'description should be a string' })
  @IsNotEmpty({ message: 'description cannot be empty' })
  @MinLength(10, { message: 'description must be at least 10 characters' })
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'price should be a number' })
  @Min(0, { message: 'price must be greater than or equal to 0' })
  @ApiPropertyOptional()
  price?: number;
}

import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'title should be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  title!: string;

  @IsString({ message: 'description should be a string' })
  @IsNotEmpty({ message: 'description is required' })
  @MinLength(10, { message: 'description must be at least 10 characters' })
  description!: string;

  @IsNumber({}, { message: 'price should be a number' })
  @Min(0, { message: 'price must be greater than or equal to 0' })
  price!: number;
}

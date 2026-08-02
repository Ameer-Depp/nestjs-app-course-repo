import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'title should be string' })
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;
}

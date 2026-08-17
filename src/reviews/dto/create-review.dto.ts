import { IsNumber, Min, Max, IsString, MinLength } from 'class-validator';

export class CreateReviewDTO {
  @IsNumber()
  @Max(5)
  @Min(1)
  rating?: number;

  @IsString()
  @MinLength(2)
  comment?: string;
}

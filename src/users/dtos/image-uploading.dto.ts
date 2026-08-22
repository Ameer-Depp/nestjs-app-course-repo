import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadingDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    name: 'profile-image',
  })
  file!: Express.Multer.File;
}

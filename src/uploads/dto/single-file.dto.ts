/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';

export class SingleFileUploadDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Single file upload',
  })
  file: Express.Multer.File | undefined;
}

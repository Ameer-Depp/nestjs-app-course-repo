/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';

export class MultipleFilesUploadDTO {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Multiple files upload',
  })
  files: Express.Multer.File[] | undefined; // Matches FilesInterceptor('files')
}

import { ApiProperty } from '@nestjs/swagger'

export class GetUploadTokenResponse {
  @ApiProperty({ description: '七牛 Upload Token' })
  token: string
}

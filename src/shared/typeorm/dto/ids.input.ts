import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class IdsInput {
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ isArray: true, type: String })
  ids: string[]
}

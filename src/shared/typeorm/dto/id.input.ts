import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class IdInput {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string
}

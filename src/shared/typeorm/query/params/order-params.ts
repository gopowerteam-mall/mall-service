import { ApiProperty } from '@nestjs/swagger'

export class OrderParams {
  @ApiProperty()
  public Order: number
}

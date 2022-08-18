import { ApiProperty } from '@nestjs/swagger'

export class SortParams {
  @ApiProperty()
  public sort: number
}

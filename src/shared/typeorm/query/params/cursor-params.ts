import { ApiProperty } from '@nestjs/swagger'

export class CursorParams {
  @ApiProperty()
  public cursor: string

  @ApiProperty()
  public size: number

  #defaultSize = 10

  constructor(cursor: string, size: number) {
    this.cursor = cursor
    this.size = size || this.#defaultSize
  }

  public get params() {
    return {
      take: this.size,
    }
  }

  public get take() {
    return this.size
  }
}

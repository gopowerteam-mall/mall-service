import { ApiProperty } from '@nestjs/swagger'

export class PageParams {
  @ApiProperty()
  public page: number

  @ApiProperty()
  public size: number

  #defaultPage = 0
  #defaultSize = 20

  constructor(page: number, size: number) {
    this.page = page || this.#defaultPage
    this.size = size || this.#defaultSize
  }

  public get params() {
    return {
      take: this.size,
      skip: this.page * this.size,
    }
  }

  public get take() {
    return this.size
  }

  public get skip() {
    return this.page * this.size
  }
}

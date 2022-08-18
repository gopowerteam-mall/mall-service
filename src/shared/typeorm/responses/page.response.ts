import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { BaseEntity } from 'typeorm'
import { PageParams } from '../query/params/page-params'

export const PageResponse = (entity: new (...args: any[]) => BaseEntity) => {
  return {
    schema: {
      allOf: [
        { $ref: getSchemaPath(Pageable) },
        {
          properties: {
            content: {
              type: 'array',
              items: { $ref: getSchemaPath(entity) },
            },
          },
        },
      ],
    },
  }
}

export class Pageable<T> {
  @ApiProperty()
  public pageNumber: number

  @ApiProperty()
  public pageSize: number

  @ApiProperty()
  public totalElements: number

  public content: T[]

  constructor(data: T[], count: number, page: PageParams) {
    this.content = data
    this.totalElements = count
    this.pageNumber = page.page
    this.pageSize = page.size
  }
}

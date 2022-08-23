import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { BaseEntity } from 'typeorm'
import { CursorParams } from '../query/params/cursor-params'

export const CursorResponse = (entity: new (...args: any[]) => BaseEntity) => {
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
  public cursor: string

  @ApiProperty()
  public finished: boolean

  public content: T[]

  constructor(data: T[], cursor: CursorParams, finished: boolean) {
    this.content = data
    this.finished = finished
    this.cursor = cursor.cursor
  }
}

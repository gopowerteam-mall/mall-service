import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from 'typeorm'
import { CursorPagingResult } from '../query/paginator/cursor-paginator'

export function toCursorResponse(entity: new (...args: any[]) => BaseEntity) {
  type Entity = typeof entity
  class CursorBaseClass implements CursorPagingResult<Entity> {
    @ApiProperty()
    public cursor: string

    @ApiProperty()
    public finished: boolean

    @ApiProperty({ type: entity, isArray: true })
    public data: Entity[]
  }

  const fun = new Function(
    'base',
    `return class Cursor${entity.name} extends base{}`,
  )

  return fun(CursorBaseClass)
}

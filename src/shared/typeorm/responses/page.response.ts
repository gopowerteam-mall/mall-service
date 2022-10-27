import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from 'typeorm'
import { IndexPagingResult } from '../query/paginator/index-paginator'

export function toPageResponse(entity: new (...args: any[]) => BaseEntity) {
  type Entity = typeof entity

  class PageBaseClass implements IndexPagingResult<Entity> {
    @ApiProperty()
    public total: number

    @ApiProperty({ type: entity, isArray: true })
    public data: Entity[]
  }

  const fun = new Function(
    'base',
    `return class Page${entity.name} extends base{}`,
  )

  return fun(PageBaseClass)
}

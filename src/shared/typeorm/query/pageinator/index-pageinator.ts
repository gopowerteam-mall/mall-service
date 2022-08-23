import { ObjectType, SelectQueryBuilder } from 'typeorm'
import { PaginatorMode } from '.'

export interface IndexPagingQuery {
  index?: number
  size?: number
  order?: 'ASC' | 'DESC'
}

export interface IndexPaginationOptions<Entity> {
  mode: PaginatorMode.index
  entity: ObjectType<Entity>
  query?: IndexPagingQuery
}

export interface PagingResult<Entity> {
  data: Entity[]
  total: number
}

/**
 * 页码分页器
 */
export class IndexPaginator<Entity> {
  private limit = 20

  public constructor(private entity: ObjectType<Entity>) {}

  public async paginate(
    builder: SelectQueryBuilder<Entity>,
  ): Promise<PagingResult<Entity>> {
    const [entities, count] = await this.appendPagingQuery(
      builder,
    ).getManyAndCount()

    return this.toPagingResult(entities, count)
  }

  private appendPagingQuery(
    builder: SelectQueryBuilder<Entity>,
  ): SelectQueryBuilder<Entity> {
    const queryBuilder = new SelectQueryBuilder<Entity>(builder)

    queryBuilder.take(this.limit)
    //     queryBuilder.orderBy(this.buildOrder())

    return queryBuilder
  }

  private toPagingResult<Entity>(
    entities: Entity[],
    total: number,
  ): PagingResult<Entity> {
    return {
      data: entities,
      total,
    }
  }
}

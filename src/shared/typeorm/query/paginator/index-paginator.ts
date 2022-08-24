import { PaginatorMode } from 'src/config/enum.config'
import { ObjectType, SelectQueryBuilder } from 'typeorm'

export interface IndexPagingQuery {
  skip: number
  limit: number
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
  private skip = 0
  private order: string

  public constructor(private entity: ObjectType<Entity>) {}

  public setLimit(limit: number) {
    this.limit = limit
  }

  public setSkip(skip: number) {
    this.skip = skip
  }

  public setOrder(order: string) {
    this.order = order
  }

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

    queryBuilder.skip(this.skip)

    // TODO: ORDER
    // queryBuilder.orderBy()
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

import { Order, PaginatorMode } from 'src/config/enum.config'
import { toUnderscore } from 'src/shared/common'
import { ObjectType, SelectQueryBuilder } from 'typeorm'

export interface IndexPagingQuery {
  skip: number
  limit: number
  order?: Record<string, Order>
}

export interface IndexPaginationOptions<Entity> {
  mode: PaginatorMode.Index
  entity: ObjectType<Entity>
  query?: IndexPagingQuery
}

export interface IndexPagingResult<Entity> {
  data: Entity[]
  total: number
}

/**
 * 页码分页器
 */
export class IndexPaginator<Entity> {
  private limit = 20
  private skip = 0
  private order: Record<string, Order>

  public constructor(private entity: ObjectType<Entity>) {}

  public setLimit(limit: number) {
    this.limit = limit
  }

  public setSkip(skip: number) {
    this.skip = skip
  }

  public setOrder(order: Record<string, Order>) {
    this.order = order
  }

  public async paginate(
    builder: SelectQueryBuilder<Entity>,
  ): Promise<IndexPagingResult<Entity>> {
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

    return this.appendOrderQuery(queryBuilder)
  }

  /**
   * 添加order语句
   * @param builder
   * @returns
   */
  private appendOrderQuery(
    builder: SelectQueryBuilder<Entity>,
  ): SelectQueryBuilder<Entity> {
    if (this.order) {
      Object.entries(this.order).forEach(([key, sort]) => {
        builder.addOrderBy(`${toUnderscore(key)}`, sort)
      })
    }

    return builder
  }

  private toPagingResult<Entity>(
    entities: Entity[],
    total: number,
  ): IndexPagingResult<Entity> {
    return {
      data: entities,
      total,
    }
  }
}

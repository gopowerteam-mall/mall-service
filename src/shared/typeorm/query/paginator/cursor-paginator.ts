import { Order, PaginatorMode } from 'src/config/enum.config'
import {
  Brackets,
  ObjectType,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm'

export interface CursorPagingQuery {
  cursor?: string
  limit: number
  order?: Order
}

export interface CursorPaginationOptions<Entity> {
  entity: ObjectType<Entity>
  mode: PaginatorMode.cursor
  query?: CursorPagingQuery
  paginationCursorKey?: Extract<keyof Entity, string>
  paginationOrderKey?: Extract<keyof Entity, string>
}

export interface PagingResult<Entity> {
  data: Entity[]
  cursor?: string
  finished: boolean
}

function camelOrPascalToUnderscore(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase()
}

export class CursorPaginator<Entity> {
  private cursor?: string

  private alias: string = camelOrPascalToUnderscore(this.entity.name)

  private limit = 10

  private order: Order = Order.DESC

  public constructor(
    private entity: ObjectType<Entity>,
    private paginationCursorKey: Extract<
      keyof Entity,
      string
    > = 'id' as Extract<keyof Entity, string>,
    private paginationOrderKey: Extract<
      keyof Entity,
      string
    > = 'created_at' as Extract<keyof Entity, string>,
  ) {}

  public setLimit(limit: number): void {
    this.limit = limit
  }

  public setOrder(order: Order): void {
    this.order = order
  }

  public setCursor(cursor: string): void {
    this.cursor = cursor
  }

  public setAlias(alias: string): void {
    this.alias = alias
  }

  public async paginate(
    builder: SelectQueryBuilder<Entity>,
  ): Promise<PagingResult<Entity>> {
    const entities = await this.appendPagingQuery(builder).getMany()
    const finished = entities.length > this.limit

    if (finished) {
      entities.splice(entities.length - 1, 1)
    }

    return this.toPagingResult(entities, finished)
  }

  /**
   * 添加分页查询
   * @param builder
   * @returns
   */
  private appendPagingQuery(
    builder: SelectQueryBuilder<Entity>,
  ): SelectQueryBuilder<Entity> {
    // builder对象
    const queryBuilder = new SelectQueryBuilder<Entity>(builder)

    // 通过游标查询数据
    if (this.cursor) {
      queryBuilder.andWhere(
        new Brackets((where) =>
          this.buildCursorQuery(this.cursor, where, builder),
        ),
      )
    }

    // 使用limit + 1来确认数据是否结束
    queryBuilder.take(this.limit + 1)
    queryBuilder.orderBy(`${this.alias}.${this.paginationOrderKey}`, this.order)

    return queryBuilder
  }

  /**
   * 构建游标查询
   * @param cursor
   * @param where
   * @param builder
   * @returns
   */
  private buildCursorQuery(
    cursor: string,
    where: WhereExpressionBuilder,
    builder: SelectQueryBuilder<Entity>,
  ): void {
    console.log(this.cursor)
    if (!this.cursor) {
      return
    }

    // TODO：使用ALIAS
    const cursorQuery = builder
      .select(`${this.alias}.${this.paginationOrderKey}`)
      .where(
        `${this.alias}.${
          this.paginationCursorKey
        } ${this.getOperator()} :paginationCursorKey`,
        {
          paginationCursorKey: cursor,
        },
      )
      .getQuery()

    where.andWhere(`${this.alias}.${this.paginationCursorKey} > ${cursorQuery}`)
  }

  /**
   * 获取操作符
   * @returns
   */
  private getOperator(): string {
    return this.order === Order.ASC ? '<' : '>'
  }

  /**
   * 获取分页结果
   * @param entities
   * @returns
   */
  private toPagingResult<Entity>(
    entities: Entity[],
    finished: boolean,
  ): PagingResult<Entity> {
    const [last] = [...(entities || [])].reverse()

    return {
      data: entities,
      cursor: last?.[this.paginationCursorKey as string],
      finished,
    }
  }
}

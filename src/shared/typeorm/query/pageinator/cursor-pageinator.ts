import { ObjectType, SelectQueryBuilder } from 'typeorm'
import { PaginatorMode } from '.'

export interface CursorPagingQuery {
  afterCursor?: string
  beforeCursor?: string
  limit?: number
  order?: 'ASC' | 'DESC'
}

export interface CursorPaginationOptions<Entity> {
  entity: ObjectType<Entity>
  mode: PaginatorMode.cursor
  query?: CursorPagingQuery
  paginationKeys?: Extract<keyof Entity, string>[]
  paginationUniqueKey?: Extract<keyof Entity, string>
}

export interface Cursor {
  beforeCursor: string | null
  afterCursor: string | null
}

export interface PagingResult<Entity> {
  data: Entity[]
  cursor: Cursor
}

export class CursorPaginator<Entity> {
  private afterCursor: string | null = null

  private beforeCursor: string | null = null

  private nextAfterCursor: string | null = null

  private nextBeforeCursor: string | null = null

  public constructor(
    private entity: ObjectType<Entity>,
    private paginationKeys: Extract<keyof Entity, string>[],
    private paginationUniqueKey: Extract<keyof Entity, string>,
  ) {}

  private hasAfterCursor(): boolean {
    return this.afterCursor !== null
  }

  private hasBeforeCursor(): boolean {
    return this.beforeCursor !== null
  }

  public async paginate(
    builder: SelectQueryBuilder<Entity>,
  ): Promise<PagingResult<Entity>> {
    return Promise.resolve({
      data: [],
      cursor: {
        beforeCursor: '',
        afterCursor: '',
      },
    })
  }

  //   private appendPagingQuery(
  //     builder: SelectQueryBuilder<Entity>,
  //   ): SelectQueryBuilder<Entity> {
  //     const cursors: CursorParam = {}
  //     const clonedBuilder = new SelectQueryBuilder<Entity>(builder)

  //     if (this.hasAfterCursor()) {
  //       Object.assign(cursors, this.decode(this.afterCursor as string))
  //     } else if (this.hasBeforeCursor()) {
  //       Object.assign(cursors, this.decode(this.beforeCursor as string))
  //     }

  //     if (Object.keys(cursors).length > 0) {
  //       clonedBuilder.andWhere(
  //         new Brackets((where) => this.buildCursorQuery(where, cursors)),
  //       )
  //     }

  //     clonedBuilder.take(this.limit + 1)
  //     clonedBuilder.orderBy(this.buildOrder())

  //     return clonedBuilder
  //   }
}

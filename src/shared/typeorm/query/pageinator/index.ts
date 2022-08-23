import { ObjectType } from 'typeorm'
import { CursorPaginationOptions, CursorPaginator } from './cursor-pageinator'
import { IndexPaginationOptions, IndexPaginator } from './index-pageinator'

export enum PaginatorMode {
  cursor = 'Cursor',
  index = 'Index',
}

export function buildPaginator<Entity>(
  options: IndexPaginationOptions<Entity>,
): IndexPaginator<Entity>
export function buildPaginator<Entity>(
  options: CursorPaginationOptions<Entity>,
): CursorPaginator<Entity>
export function buildPaginator<Entity>(
  options: IndexPaginationOptions<Entity> | CursorPaginationOptions<Entity>,
): IndexPaginator<Entity> | CursorPaginator<Entity> {
  const { entity } = options

  switch (options.mode) {
    case PaginatorMode.cursor:
      const {
        query = {},
        paginationKeys = ['id' as any],
        paginationUniqueKey = 'id' as any,
      } = options
      return new CursorPaginator(entity, paginationKeys, paginationUniqueKey)
    case PaginatorMode.index:
      return new IndexPaginator(entity)
  }
}

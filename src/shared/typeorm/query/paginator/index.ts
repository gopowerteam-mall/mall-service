import { PaginatorMode } from 'src/config/enum.config'
import { CursorPaginationOptions, CursorPaginator } from './cursor-paginator'
import { IndexPaginationOptions, IndexPaginator } from './index-paginator'

export function buildPaginator<Entity>(
  options: IndexPaginationOptions<Entity>,
): IndexPaginator<Entity>
export function buildPaginator<Entity>(
  options: CursorPaginationOptions<Entity>,
): CursorPaginator<Entity>
export function buildPaginator<Entity>(
  options: IndexPaginationOptions<Entity> | CursorPaginationOptions<Entity>,
): IndexPaginator<Entity> | CursorPaginator<Entity> {
  // 创建页码分页器
  const builderIndexPaginator = (options: IndexPaginationOptions<Entity>) => {
    const paginator = new IndexPaginator(options.entity)

    // 设置参数
    paginator.setSkip(options.query?.skip)
    paginator.setLimit(options.query?.limit)
    paginator.setOrder(options.query?.order)

    return paginator
  }

  // 创建游标分页器
  const builderCursorPaginator = (options: CursorPaginationOptions<Entity>) => {
    const paginator = new CursorPaginator(
      options.entity,
      options.paginationCursorKey,
      options.paginationOrderKey,
    )

    paginator.setLimit(options?.query?.limit)
    paginator.setOrder(options?.query?.order)
    paginator.setCursor(options?.query?.cursor)

    return paginator
  }

  switch (options.mode) {
    case PaginatorMode.cursor:
      return builderCursorPaginator(options)
    case PaginatorMode.index:
      return builderIndexPaginator(options)
  }
}

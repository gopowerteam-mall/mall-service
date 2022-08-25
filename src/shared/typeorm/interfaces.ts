import { Order } from 'src/config/enum.config'
import { Brackets, FindOptionsWhere } from 'typeorm'
import { QueryInput } from './query/inputs/query.input'
import { CursorParams } from './query/params/cursor-params'
import { PageParams } from './query/params/page-params'

export interface QueryInputParam<T = any> {
  order?: Record<string, Order>
  page?: PageParams
  cursor?: CursorParams
  buildWhereQuery: (alias?: string) => Brackets
  buildWhereParams: () => FindOptionsWhere<T>
}

export type Constructor<T = QueryInput> = new (...args: any[]) => T

import { FindOptionsOrder, FindOptionsWhere } from 'typeorm'
import { QueryInput } from './query/inputs/query.input'
import { PageParams } from './query/params/page-params'

export interface QueryInputParam<T = any> {
  where?: FindOptionsWhere<T>
  order?: FindOptionsOrder<T>
  page?: PageParams
}

export type Constructor<T = QueryInput> = new (...args: any[]) => T

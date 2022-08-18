import { FindOptionsWhere } from 'typeorm'
import { QueryInput } from './inputs/query.input'
import { PageParams } from './params/page-params'

export interface QueryInputParam<T = any> {
  where?: FindOptionsWhere<T>
  page?: PageParams
}

export type Constructor<T = QueryInput> = new (...args: any[]) => T

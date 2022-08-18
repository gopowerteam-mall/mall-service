import { Between, FindOptionsWhere, In, Like } from 'typeorm'
import {
  WHERE_OPTION_METADATA,
  WHERE_OPTION_TYPE_METADATA,
} from 'src/config/constants'
import { PageParams } from '../params/page-params'

export class QueryInput<T = any> {
  /**
   * 获取查询参数
   */
  public get whereParams(): FindOptionsWhere<T> {
    const params = Object.getOwnPropertyNames(this)
      .filter((key) => Reflect.getMetadata(WHERE_OPTION_METADATA, this, key))
      .filter((key: string) => this[key] !== undefined)
      .reduce((result, key) => {
        const type = Reflect.getMetadata(WHERE_OPTION_TYPE_METADATA, this, key)
        switch (type) {
          case 'in':
            result[key] = In(this[key])
          case 'like':
            result[key] = Like(`%${this[key]}%`)
          case 'between':
            result[key] = Between(this[key][0], this[key][1])
        }
        return result
      }, {})

    return params
  }

  /**
   * 获取分页参数
   */
  public get pageParams() {
    return new PageParams(this['page'], this['size'])
  }

  /**
   * 获取排序参数
   */
  public get sortParams() {
    return {}
  }

  /**
   * 获取所有参数
   */
  public get params() {
    return {
      where: this.whereParams,
      page: this.pageParams,
      sort: this.sortParams,
    }
  }
}

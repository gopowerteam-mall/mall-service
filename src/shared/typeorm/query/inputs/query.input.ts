import { Between, Brackets, FindOptionsWhere, In, Like } from 'typeorm'
import {
  WHERE_OPTION_ENTITY_METADATA,
  WHERE_OPTION_METADATA,
  WHERE_OPTION_NAME_METADATA,
  WHERE_OPTION_TYPE_METADATA,
} from 'src/config/constants'
import { PageParams } from '../params/page-params'
import { QueryInputParam } from '../../interfaces'
import { WhereOperator } from 'src/config/enum.config'
import { toUnderscore } from 'src/shared/common'
import { CursorParams } from '../params/cursor-params'

export class QueryInput<T = any> {
  /**
   * 获取查询参数
   */
  public buildWhereParams(): FindOptionsWhere<T> {
    const params = Object.getOwnPropertyNames(this)
      .filter((key) => Reflect.getMetadata(WHERE_OPTION_METADATA, this, key))
      .filter((key: string) => this[key] !== undefined)
      .reduce((result, key) => {
        const type = Reflect.getMetadata(WHERE_OPTION_TYPE_METADATA, this, key)
        const name = Reflect.getMetadata(WHERE_OPTION_NAME_METADATA, this, key)

        switch (type) {
          case WhereOperator.In:
            result[name || key] = In(this[key])
            break
          case WhereOperator.Like:
            result[name || key] = Like(`%${this[key]}%`)
            break
          case WhereOperator.Between:
            result[name || key] = Between(this[key][0], this[key][1])
            break
          case WhereOperator.Equal:
            result[name || key] = this[key]
            break
        }
        return result
      }, {})

    return params
  }

  public buildWhereQuery() {
    return new Brackets((where) => {
      Object.getOwnPropertyNames(this)
        .filter((key) => Reflect.getMetadata(WHERE_OPTION_METADATA, this, key))
        .filter((key: string) => this[key] !== undefined)
        .forEach((key) => {
          const type = Reflect.getMetadata(
            WHERE_OPTION_TYPE_METADATA,
            this,
            key,
          )

          const customName = Reflect.getMetadata(
            WHERE_OPTION_NAME_METADATA,
            this,
            key,
          )

          const entity = Reflect.getMetadata(
            WHERE_OPTION_ENTITY_METADATA,
            this,
            key,
          )

          // 添加别名支持
          const name = entity
            ? `${entity}.${customName || toUnderscore(key)}`
            : customName || toUnderscore(key)

          switch (type) {
            case WhereOperator.In:
              where.andWhere(`${name} IN :${key}`, {
                [key]: this[key],
              })

              break
            case WhereOperator.Like:
              where.andWhere(`${name} LIKE :${key}`, {
                [key]: `%${this[key]}%`,
              })

              break
            case WhereOperator.Between:
              const [min, max] = this[key]

              where.andWhere(`${name} >= :min`, {
                min,
              })

              where.andWhere(`${name} < :max`, {
                max,
              })
              break
            case WhereOperator.Equal:
              where.andWhere(`${name} = :${key}`, {
                [key]: this[key],
              })
              break
          }
        })
    })
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
  public get orderParams() {
    return this['order']
  }

  /**
   * 获取排序参数
   */
  public get cursorParams() {
    return new CursorParams(
      this['cursor'],
      this['size'],
      this['cursorKey'],
      this['orderKey'],
    )
  }

  /**
   * 获取所有参数
   */
  public get params(): QueryInputParam<T> {
    return {
      order: this.orderParams,
      page: this.pageParams,
      cursor: this.cursorParams,
      buildWhereParams: this.buildWhereParams.bind(this),
      buildWhereQuery: this.buildWhereQuery.bind(this),
    }
  }
}

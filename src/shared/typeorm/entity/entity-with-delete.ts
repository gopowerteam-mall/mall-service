import { DeleteDateColumn, Timestamp } from 'typeorm'
import { Constructor } from '.'

/**
 * 基础实体类型
 * 默认添加createAt字段 *
 * 默认添加updateAt字段 *
 * @param Base
 * @returns
 */
export function EntityWithSoftDelete<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @DeleteDateColumn({ type: 'timestamp without time zone' })
    public deleteAt: Date
  }
  return AbstractBase
}

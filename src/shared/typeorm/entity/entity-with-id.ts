import { Constructor } from '.'
import { PrimaryGeneratedColumn } from 'typeorm'
/**
 * 基础实体类型
 * 默认添加id字段
 * @param Base
 * @returns
 */
export function EntityWithID<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @PrimaryGeneratedColumn('increment')
    id: number
  }
  return AbstractBase
}

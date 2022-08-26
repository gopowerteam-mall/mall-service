import { ApiProperty } from '@nestjs/swagger'
import { Column } from 'typeorm'
import { Constructor } from '.'

/**
 * 基础实体类型
 * 默认添加createAt字段 *
 * 默认添加updateAt字段 *
 * @param Base
 * @returns
 */
export function EntityWithSort<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @Column({ generated: 'increment' })
    @ApiProperty({ description: '排序', type: 'number' })
    public sort: number
  }
  return AbstractBase
}

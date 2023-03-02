import { Constructor } from '.'
import { Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 基础实体类型
 * 默认添加enable字段
 * @param Base
 * @returns
 */
export function EntityWithEnable<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ description: '启用状态', type: 'boolean' })
    @Column({ type: 'boolean', default: true })
    enable: boolean
  }
  return AbstractBase
}

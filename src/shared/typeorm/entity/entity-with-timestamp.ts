import { ApiProperty } from '@nestjs/swagger'
import { CreateDateColumn, Timestamp, UpdateDateColumn } from 'typeorm'
import { Constructor } from '.'

/**
 * 基础实体类型
 * 默认添加createAt字段 *
 * 默认添加updateAt字段 *
 * @param Base
 * @returns
 */
export function EntityWithTime<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @CreateDateColumn()
    @ApiProperty({ description: '创建日期', type: 'string' })
    public createdAt: Date

    @UpdateDateColumn()
    @ApiProperty({ description: '更新日期', type: 'string' })
    public updatedAt: Date
  }
  return AbstractBase
}

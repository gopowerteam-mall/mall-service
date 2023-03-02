import { ApiProperty } from '@nestjs/swagger'
import { PrimaryGeneratedColumn } from 'typeorm'
import { Constructor } from '.'
/**
 * 基础实体类型
 * 默认添加id字段
 * @param Base
 * @returns
 */
export function EntityWithUUID<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ description: 'ID', type: 'string' })
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string
  }
  return AbstractBase
}

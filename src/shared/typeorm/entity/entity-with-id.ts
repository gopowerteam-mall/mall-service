import { Constructor } from '.'
import { PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
/**
 * 基础实体类型
 * 默认添加id字段
 * @param Base
 * @returns
 */
export function EntityWithID<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ description: 'ID', type: 'number' })
    @PrimaryGeneratedColumn('increment')
    id: number
  }
  return AbstractBase
}

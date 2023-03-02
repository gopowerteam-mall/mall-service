import { ApiProperty } from '@nestjs/swagger'
import { RequestContext } from 'src/middlewaves/request-context.middlewave'
import { BeforeInsert, Column } from 'typeorm'
import { Constructor } from '.'

/**
 * 基础实体类型
 * 默认添加creator字段 *
 * @param Base
 * @returns
 */
export function EntityWithCreator<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ description: '创建人', type: 'string' })
    @Column()
    public creator: string

    @BeforeInsert()
    setCreator() {
      this.creator = RequestContext.currentContext.user
    }
  }
  return AbstractBase
}

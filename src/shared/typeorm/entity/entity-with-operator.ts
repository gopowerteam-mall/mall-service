import { RequestContext } from 'src/middlewaves/request-context.middlewave'
import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column } from 'typeorm'
import { Constructor } from '.'

/**
 * 基础实体类型
 * 默认添加operator字段 *
 * @param Base
 * @returns
 */
export function EntityWithOperator<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @Column()
    public operator: string

    @BeforeInsert()
    @BeforeUpdate()
    @BeforeSoftRemove()
    setOperator() {
      this.operator = RequestContext.currentContext.user
    }
  }
  return AbstractBase
}

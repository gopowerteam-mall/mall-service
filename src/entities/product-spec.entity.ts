import { Entity, Column, ManyToOne } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithTime,
  EntityClass,
  EntityWithDelete,
  EntityWithUUID,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithCreator } from 'src/shared/typeorm/entity/entity-with-creator'
import { EntityWithOperator } from 'src/shared/typeorm/entity/entity-with-operator'
import { Product } from './product.entity'

@Entity('product-spec')
export class ProductSpec extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '删除', type: () => Product })
  @ManyToOne(() => Product)
  product: Product

  @ApiProperty({ description: '属性项组合' })
  @Column({ type: 'text', array: true })
  items: string[]

  @ApiProperty()
  @Column()
  price: number
}

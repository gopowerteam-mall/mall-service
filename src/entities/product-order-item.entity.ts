import { Column, Entity, ManyToOne, OneToOne } from 'typeorm'
import { pipe } from 'ramda'
import { EntityClass, EntityWithUUID } from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithCreator } from 'src/shared/typeorm/entity/entity-with-creator'
import { EntityWithOperator } from 'src/shared/typeorm/entity/entity-with-operator'
import { ProductSpec } from './product-spec.entity'
import { ProductOrder } from './product-order.entity'

@Entity('product-order-item')
export class ProductOrderItem extends pipe(
  EntityWithUUID,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '标题' })
  @Column()
  productTitle: string

  /**
   * 商品单价
   * 保存订单时价格,用于保存快照信息
   */
  @ApiProperty({ description: '商品单价' })
  @Column()
  unitPrice: number

  /**
   * 商品总价
   */
  @ApiProperty({ description: '商品总价' })
  @Column()
  totalPrice: number

  /**
   * 购买数量
   */
  @ApiProperty({ description: '购买数量' })
  @Column()
  count: number

  /**
   * 商品订单
   */
  @ApiProperty({ description: '商品订单' })
  @ManyToOne(() => ProductOrder, (order) => order.items)
  productOrder: ProductOrder

  /**
   * 商品SKU
   */
  @ApiProperty({ description: '商品Spec' })
  @OneToOne(() => ProductSpec)
  productSpec: ProductSpec
}

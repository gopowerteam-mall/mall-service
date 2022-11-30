import { Entity, Column, OneToMany, OneToOne } from 'typeorm'
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
import { ProductOrderState } from 'src/config/enum.config'
import { ProductOrderItem } from './product-order-item.entity'
import { PaymentOrder } from './payment-order.entity'

@Entity('product-order')
export class ProductOrder extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '商品订单状态', enum: ProductOrderState })
  @Column({ enum: ProductOrderState })
  state: ProductOrderState

  @ApiProperty({
    description: '所属商品',
    isArray: true,
    type: ProductOrderItem,
  })
  @OneToMany(() => ProductOrderItem, (item) => item.productOrder)
  items: ProductOrderItem[]

  @ApiProperty({ description: '订单金额' })
  @Column()
  price: number

  @ApiProperty({ description: '支付订单', type: () => PaymentOrder })
  @OneToOne(() => PaymentOrder)
  paymentOrder: PaymentOrder
}

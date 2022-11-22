import { Entity, Column, OneToMany } from 'typeorm'
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
import { PaymentOrderState } from 'src/config/enum.config'
import { ProductOrder } from './product-order.entity'

@Entity('payment-order')
export class PaymentOrder extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '商品订单' })
  @OneToMany(() => ProductOrder, (item) => item.paymentOrder)
  orders: ProductOrder[]

  @ApiProperty({ description: '订单金额' })
  price: number

  @ApiProperty({ description: '支付订单状态', enum: PaymentOrderState })
  @Column({ enum: PaymentOrderState })
  state: PaymentOrderState
}

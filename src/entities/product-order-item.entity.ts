import { Entity, Column, OneToMany, ManyToOne } from 'typeorm'
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
import { ProductAttrItem } from './product-attr-item.entity'
import { ProductSpec } from './product-spec.entity'
import { ProductOrderState } from 'src/config/enum.config'
import { ProductOrder } from './product-order.entity'

@Entity('product-order-item')
export class ProductOrderItem extends pipe(
  EntityWithUUID,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '商品订单' })
  order: ProductOrder

  @ApiProperty({ description: '商品Spec' })
  productSpec: ProductSpec

  @ApiProperty({ description: '购买数量' })
  count: number
}

import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithOperator } from 'src/shared/typeorm/entity/entity-with-operator'
import { EntityWithCreator } from 'src/shared/typeorm/entity/entity-with-creator'
import { Product } from './product.entity'
import { ProductAttr } from './product-attr.entity'
import { ProductSpec } from './product-spec.entity'

@Entity('product-version')
export class ProductVersion extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '版本号' })
  @Column({ generated: true })
  version: number

  @ApiProperty({ description: '关联商品' })
  @ManyToOne(() => Product, (product) => product.versions)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @ApiProperty({ description: '关联商品属性' })
  @OneToMany(() => ProductAttr, (productAttr) => productAttr.version)
  attrs: ProductAttr[]

  @ApiProperty({ description: '关联商品Spec' })
  @OneToMany(() => ProductSpec, (productSpec) => productSpec.version)
  specs: ProductSpec[]
}

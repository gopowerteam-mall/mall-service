import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
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
import { ProductAttr } from './product-attr.entity'

@Entity('product-attr-item')
export class ProductAttrItem extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '属性项名称' })
  name: string

  @ApiProperty({ description: '图片' })
  @Column({ nullable: true })
  image: string

  @ApiProperty({ description: '所属属性' })
  @ManyToOne(() => ProductAttr, (attr) => attr.items)
  @JoinColumn({ name: 'attr_id' })
  attr: ProductAttr
}

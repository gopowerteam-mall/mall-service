import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
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
import { ProductAttrItem } from './product-attr-item.entity'
import { ProductVersion } from './product-version.entity'

@Entity('product-attr')
export class ProductAttr extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '属性名称' })
  @Column()
  name: string

  @ApiProperty({ description: '是否是主属性' })
  @Column()
  primary: boolean

  @ApiProperty({ description: '所属商品版本' })
  @ManyToOne(() => ProductVersion, (version) => version.attrs)
  @JoinColumn({ name: 'version_id' })
  version: ProductVersion

  @ApiProperty({ description: '属性项' })
  @OneToMany(() => ProductAttrItem, (item) => item.attr)
  items: ProductAttrItem[]
}

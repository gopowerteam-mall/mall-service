import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm'
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
import { ProductVersion } from './product-version.entity'
import { ProductAttrItem } from './product-attr-item.entity'

@Entity('product-spec')
export class ProductSpec extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '删除' })
  @ManyToOne(() => ProductVersion, (productVersion) => productVersion.specs)
  @JoinColumn({ name: 'version_id' })
  version: ProductVersion

  @ApiProperty({ description: '属性项组合' })
  @ManyToMany(() => ProductAttrItem)
  @JoinTable()
  items: ProductAttrItem[]

  @ApiProperty()
  @Column({ nullable: true })
  price?: number
}

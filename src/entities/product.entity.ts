import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
  EntityWithDelete,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithOperator } from 'src/shared/typeorm/entity/entity-with-operator'
import { EntityWithCreator } from 'src/shared/typeorm/entity/entity-with-creator'
import { Category } from './category.entity'
import { ProductAttr } from './product-attr.entity'
import { ProductSpec } from './product-spec.entity'

@Entity('product')
export class Product extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '标题' })
  @Column()
  title: string

  @ApiProperty({ description: '副标题' })
  @Column()
  subtitle: string

  @ApiProperty({ description: '关键字' })
  @Column({ type: 'text', array: true })
  keyword: string[]

  @ApiProperty({ description: '推荐' })
  @Column()
  recommended: boolean

  @ApiProperty({ description: 'Bannner' })
  @Column({ type: 'text', array: true })
  banners: string[]

  @ApiProperty({ description: '封面' })
  @Column()
  cover: string

  @ApiProperty({ description: '内容图' })
  @Column({ type: 'text', array: true })
  contents: string[]

  @ApiProperty({ description: '分类' })
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ApiProperty({ description: '属性' })
  @OneToMany(() => ProductAttr, (attr) => attr.product)
  attrs: ProductAttr[]

  @ApiProperty({ description: '规格项' })
  @OneToMany(() => ProductSpec, (spec) => spec.product)
  specs: ProductSpec[]

  @ApiProperty({ description: '最低价' })
  get minPrice() {
    return Math.min(...this.specs.map((spec) => spec.price))
  }

  @ApiProperty({ description: '最高价' })
  get maxPrice() {
    return Math.max(...this.specs.map((spec) => spec.price))
  }
}

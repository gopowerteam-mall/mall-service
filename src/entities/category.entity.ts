import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
  EntityWithSort,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('category')
export class Category extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
  EntityWithSort,
)(EntityClass) {
  @ApiProperty({ description: '标题' })
  @Column()
  title: string

  @ApiProperty({ description: '图片' })
  @Column({ nullable: true })
  image: string

  @ApiProperty({ description: '推荐' })
  @Column()
  recommended: boolean

  @ApiProperty({ description: '父节点' })
  @ManyToOne(() => Category, (category) => category.children, {
    cascade: true,
    eager: true,
  })
  parent: Category

  @ApiProperty({ description: '子节点' })
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[]
}

import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { pipe } from 'ramda'
import { EntityClass, EntityWithUUID } from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { Material } from './material.entity'

@Entity('material-group')
export class MaterialGroup extends pipe(EntityWithUUID)(EntityClass) {
  @ApiProperty({ description: '素材分组名称' })
  @PrimaryColumn()
  name: string
}

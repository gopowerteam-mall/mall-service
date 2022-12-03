import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithTime,
  EntityClass,
  EntityWithDelete,
  EntityWithUUID,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { AppOrigin, FileType } from 'src/config/enum.config'
import { EntityWithCreator } from 'src/shared/typeorm/entity/entity-with-creator'
import { EntityWithOperator } from 'src/shared/typeorm/entity/entity-with-operator'
import { MaterialGroup } from './material-group.entity'

@Entity('material')
export class Material extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '素材Key' })
  @Column({ unique: true })
  key: string

  @ApiProperty({ description: '素材类型' })
  @Column({ enum: FileType })
  type: FileType

  @ApiProperty({ description: '来源' })
  @Column({ enum: AppOrigin })
  origin: AppOrigin

  @ApiProperty({ description: '分组' })
  @ManyToOne(() => MaterialGroup, { nullable: true })
  @JoinColumn({
    name: 'group_id',
  })
  group: MaterialGroup
}

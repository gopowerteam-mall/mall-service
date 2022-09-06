import { Entity, Column } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('user_profile')
export class UserProfile extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '用户性别' })
  @Column()
  gender: string

  @ApiProperty({ description: '生日' })
  @Column({
    type: 'timestamp without time zone',
  })
  birthday: Date

  @ApiProperty({ description: '介绍' })
  @Column()
  introduce: string
}

import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('admin')
export class Admin extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '用户名' })
  @Column({ unique: true })
  username: string

  @ApiProperty({ description: '姓名' })
  @Column()
  realname: string

  @Column()
  password: string
}

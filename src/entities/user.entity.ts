import { Entity, Column } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('user')
export class User extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '用户昵称' })
  @Column()
  nickname: string

  @ApiProperty({ description: 'OPENID' })
  @Column()
  openid: string

  @ApiProperty({ description: 'UNIONID' })
  @Column({ nullable: true })
  unionid: string

  @ApiProperty({ description: '手机号码' })
  @Column({ nullable: true })
  mobile: string

  @ApiProperty({ description: '用户头像' })
  @Column({ nullable: true })
  avatar: string
}

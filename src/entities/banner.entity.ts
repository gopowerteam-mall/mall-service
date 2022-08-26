import { Entity, Column } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
  EntityWithSort,
} from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { BannerType } from 'src/config/enum.config'

@Entity('banner')
export class Banner extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
  EntityWithSort,
)(EntityClass) {
  @ApiProperty({ description: 'title' })
  @Column()
  title: string

  @ApiProperty({ description: 'Banner图片' })
  @Column()
  image: string

  @ApiProperty({ description: 'Banner类型', enum: BannerType })
  @Column({ enum: BannerType })
  type: BannerType

  @ApiProperty({ description: '参数' })
  @Column()
  target: string
}

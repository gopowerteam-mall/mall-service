import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'
import { BannerType, WhereOperator } from 'src/config/enum.config'
import { Banner } from 'src/entities/banner.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

/**
 * 添加Banner
 */
export class CreateBannerInput {
  @ApiProperty({ required: false })
  @Optional()
  title: string

  @ApiProperty({ description: 'Banner图片' })
  image: string

  @ApiProperty({ description: 'Banner类型', enum: BannerType })
  type: BannerType

  @ApiProperty({ description: '参数' })
  target: string
}

/**
 * 更新Banner
 */
export class UpdateBannerInput extends PartialType(CreateBannerInput) {}

/**
 * 查询Banner
 */
export class FindBannerInput extends QueryInput<Banner> {
  @ApiProperty({ description: 'Banner类型', enum: BannerType, required: false })
  @WhereOption({ type: WhereOperator.Equal })
  @Optional()
  type: BannerType
}

/**
 * 查询Banner
 */
export class ChangeBannerOrderInput {
  @ApiProperty({ description: '目标位置Id' })
  @IsUUID()
  target: string
}

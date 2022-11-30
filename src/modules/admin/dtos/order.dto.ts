import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class SubmitOrderItemInput {
  @ApiProperty({ description: '商品ID' })
  productId: string

  @ApiProperty({ description: '商品Spec ID' })
  productSpecId: string

  @ApiProperty({ description: '购买数量' })
  count: number
}

/**
 * 提交订单
 */
export class SubmitOrderInput {
  @ApiProperty({ isArray: true, type: SubmitOrderItemInput })
  @Type(() => SubmitOrderItemInput)
  items: SubmitOrderItemInput[]
}

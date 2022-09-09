import { ApiProperty, PartialType } from '@nestjs/swagger'
import { MaterialGroup } from 'src/entities/material-group.entity'

export class MaterialGroupResponse extends PartialType(MaterialGroup) {
  @ApiProperty({ description: '分类素材数量' })
  count: number
}

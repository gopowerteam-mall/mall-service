import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Constructor } from '../../interfaces'

export function CursorInput<T extends Constructor>(Base: T) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ required: false, description: '游标ID' })
    @IsOptional()
    @IsString()
    public cursor: string

    @ApiProperty({ required: false, description: '查询数量' })
    @IsOptional()
    @IsNumber()
    public size: number

    @ApiProperty({ required: false, description: '游标列' })
    @IsOptional()
    @IsString()
    public cursorKey: string

    @ApiProperty({ required: false, description: '排序列' })
    @IsOptional()
    @IsString()
    public orderKey: string
  }

  return AbstractBase
}

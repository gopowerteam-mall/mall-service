import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { Constructor } from '../../interfaces'

export function CurSorInput<T extends Constructor>(Base: T) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ required: false, description: '游标ID' })
    @IsOptional()
    @IsNumber()
    public cursor: string

    @ApiProperty({ required: false, description: '分页容量' })
    @IsOptional()
    @IsNumber()
    public size: number
  }

  return AbstractBase
}

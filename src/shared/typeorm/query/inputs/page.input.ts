import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { Constructor } from '../../interfaces'

export function PageInput<T extends Constructor>(Base: T) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ required: false, description: '分页页码' })
    @IsOptional()
    @IsNumber()
    public page: number

    @ApiProperty({ required: false, description: '分页容量' })
    @IsOptional()
    @IsNumber()
    public size: number
  }

  return AbstractBase
}

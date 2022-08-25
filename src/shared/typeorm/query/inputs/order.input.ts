import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { Order } from 'src/config/enum.config'
import { Constructor } from '../../interfaces'

export function OrderInput<T extends Constructor>(Base: T) {
  abstract class AbstractBase extends Base {
    @ApiProperty({
      required: false,
      type: 'string',
      description: '排序: createdAt,desc;',
    })
    @IsOptional()
    @Transform(({ value }: { value: string }) => {
      return value.split(';').reduce((r, v) => {
        const [key, sort] = v.split(',')
        if (key && sort && Object.keys(Order).includes(sort.toUpperCase())) {
          r[key] = sort.toUpperCase()
        }
        return r
      }, {})
    })
    public order: Record<string, Order>
  }

  return AbstractBase
}

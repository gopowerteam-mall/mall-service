import { ApiProperty } from '@nestjs/swagger'
import { Constructor } from '../interfaces'

export function PageInput<T extends Constructor>(Base: T) {
  abstract class AbstractBase extends Base {
    @ApiProperty()
    public page: number

    @ApiProperty()
    public size: number
  }

  return AbstractBase
}

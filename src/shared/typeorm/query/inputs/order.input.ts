import { ApiProperty } from '@nestjs/swagger'
import { Constructor } from '../../interfaces'

export function OrderParamsInput<T extends Constructor>(Base: T) {
  abstract class AbstractBase extends Base {
    @ApiProperty()
    public order: Record<string, string>
  }

  return AbstractBase
}

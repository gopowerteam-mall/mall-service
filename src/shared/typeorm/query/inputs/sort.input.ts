import { ApiProperty } from '@nestjs/swagger'
import { Constructor } from '../interfaces'

export function SortParamsInput<T extends Constructor>(Base: T) {
  abstract class AbstractBase extends Base {
    @ApiProperty()
    public sort: Record<string, string>
  }

  return AbstractBase
}

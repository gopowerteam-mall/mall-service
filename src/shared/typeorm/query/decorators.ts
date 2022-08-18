import { applyDecorators } from '@nestjs/common'
import {
  WHERE_OPTION_METADATA,
  WHERE_OPTION_TYPE_METADATA,
} from 'src/config/constants'

export type WhereOption = {
  type?: 'in' | 'like' | 'equal' | 'between'
}

export function WhereOption(option: WhereOption) {
  return applyDecorators(
    Reflect.metadata(WHERE_OPTION_METADATA, true),
    Reflect.metadata(WHERE_OPTION_TYPE_METADATA, option.type || 'equal'),
  )
}

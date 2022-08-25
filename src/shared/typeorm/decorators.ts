import { applyDecorators } from '@nestjs/common'
import {
  WHERE_OPTION_METADATA,
  WHERE_OPTION_TYPE_METADATA,
} from 'src/config/constants'
import { WhereOperator } from 'src/config/enum.config'

export type WhereOption = {
  type?: WhereOperator
}

export function WhereOption(option: WhereOption) {
  return applyDecorators(
    Reflect.metadata(WHERE_OPTION_METADATA, true),
    Reflect.metadata(
      WHERE_OPTION_TYPE_METADATA,
      option.type || WhereOperator.Equal,
    ),
  )
}

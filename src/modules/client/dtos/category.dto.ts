import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { WhereOperator } from 'src/config/enum.config'
import { Category } from 'src/entities/category.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

export class FindCategoryInput extends QueryInput<Category> {
  @ApiProperty({ description: '是否推荐', required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal, entity: 'category' })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true'
  })
  recommended: boolean
}

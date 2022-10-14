import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { pipe } from 'rxjs'
import { WhereOperator } from 'src/config/enum.config'
import { Product } from 'src/entities/product.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { CursorInput } from 'src/shared/typeorm/query/inputs/cursor.input'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

export class FindProductInput extends pipe(CursorInput)(QueryInput<Product>) {
  @ApiProperty({ description: '是否推荐', required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal, entity: 'product' })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true'
  })
  recommended: boolean
}

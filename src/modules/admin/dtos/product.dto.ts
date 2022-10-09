import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { WhereOperator } from 'src/config/enum.config'
import { Product } from 'src/entities/product.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

export class createProductAttrItemInput {
  @ApiProperty({ description: '属性ID' })
  @IsUUID()
  id: string

  @ApiProperty({ description: '属性项名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '图片' })
  @IsString()
  @IsOptional()
  image: string
}

export class createProductAttrInput {
  @ApiProperty({ description: '属性名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '是否是主属性' })
  @IsBoolean()
  primary: boolean

  @ApiProperty({
    description: '属性项',
    type: createProductAttrItemInput,
    isArray: true,
  })
  @Type(() => createProductAttrItemInput)
  items: createProductAttrItemInput[]
}

export class createProductSpecInput {
  @ApiProperty({ description: '属性项组合[]' })
  @IsString({ each: true })
  items: string[]

  @ApiProperty()
  @IsNumber()
  price: number
}

export class CreateProductInput {
  @ApiProperty({ description: '标题', required: true })
  @IsString()
  title: string

  @ApiProperty({ description: '副标题' })
  @IsString()
  subtitle: string

  @ApiProperty({ description: '关键字' })
  @IsString({ each: true })
  keyword: string[]

  @ApiProperty({ description: '推荐' })
  @IsBoolean()
  recommend: boolean

  @ApiProperty({ description: 'Bannner' })
  @IsString({ each: true })
  banners: string[]

  @ApiProperty({ description: '封面' })
  @IsString()
  cover: string

  @ApiProperty({ description: '内容图' })
  @IsString({ each: true })
  contents: string[]

  @ApiProperty({ description: '分类' })
  @IsString()
  categoryId: string

  @ApiProperty({
    description: '属性',
    type: createProductAttrInput,
    isArray: true,
  })
  @Type(() => createProductAttrInput)
  attrs: createProductAttrInput[]

  @ApiProperty({
    description: '规格项',
    type: createProductSpecInput,
    isArray: true,
  })
  @Type(() => createProductSpecInput)
  specs: createProductSpecInput[]
}

export class UpdateProductInput extends PartialType(CreateProductInput) {}

export class FindProductInput extends QueryInput<Product> {
  @ApiProperty({ description: '标题', required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Like })
  title: string

  @ApiProperty({ description: '是否推荐', required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true'
  })
  recommended: boolean
}

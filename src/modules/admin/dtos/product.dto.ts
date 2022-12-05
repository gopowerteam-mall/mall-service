import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator'
import { pipe } from 'rxjs'
import { WhereOperator } from 'src/config/enum.config'
import { Product } from 'src/entities/product.entity'
import { WhereOption } from 'src/shared/typeorm/decorators'
import { OrderInput } from 'src/shared/typeorm/query/inputs/order.input'
import { PageInput } from 'src/shared/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/shared/typeorm/query/inputs/query.input'

export class productAttrItemInput {
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

export class productAttrInput {
  @ApiProperty({ description: '属性名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '是否是主属性' })
  @IsBoolean()
  primary: boolean
}

export class productSpecInput {
  @ApiProperty({ description: 'SpecId' })
  @IsUUID()
  id: string

  @ApiProperty()
  @IsNumber()
  price: number
}

export class SetupProductAttrsInput {
  @ApiProperty({
    description: '商品属性列表',
  })
  @Type(() => productAttrInput)
  attrs: productAttrInput[]
}

export class SetupProductAttrItemsInput {
  @ApiProperty({
    description: '商品属性项列表',
  })
  @Type(() => productAttrInput)
  items: productAttrItemInput[]
}

export class SetupProductSpecsInput {
  @ApiProperty({
    description: '商品Spec列表',
  })
  @Type(() => productAttrInput)
  specs: productSpecInput[]
}

export class CreateProductInput {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string

  @ApiProperty({ description: '副标题' })
  @IsString()
  subtitle: string

  @ApiProperty({ description: '关键字' })
  @IsString({ each: true })
  @MinLength(1)
  keyword: string[]

  @ApiProperty({ description: '推荐' })
  @IsBoolean()
  recommended: boolean

  @ApiProperty({ description: 'Bannner' })
  @IsString({ each: true })
  @MinLength(1)
  banners: string[]

  @ApiProperty({ description: '封面' })
  @IsString()
  cover: string

  @ApiProperty({ description: '内容图' })
  @IsString({ each: true })
  @MinLength(1)
  contents: string[]

  @ApiProperty({ description: '分类' })
  @IsString()
  categoryId: string
}

export class UpdateProductInput extends PartialType(CreateProductInput) {}

export class FindProductInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Product>) {
  @ApiProperty({ description: '标题' })
  @Optional()
  @WhereOption({ type: WhereOperator.Like })
  title?: string

  @ApiProperty({ description: '分类' })
  @Optional()
  @WhereOption({ name: 'category_id', type: WhereOperator.Equal })
  category?: string

  @ApiProperty({ description: '是否推荐' })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true'
  })
  recommended?: boolean
}

export class PublishProductInput {
  @ApiProperty({ description: '商品ID' })
  @IsUUID()
  id: string

  @ApiProperty({ description: '商品配置版本ID' })
  @IsUUID()
  versionId: string
}

export class UpdateProductAttrInput {
  @ApiProperty({ description: '属性名称' })
  @IsString()
  name: string
}

export class UpdateProductAttrItemInput {
  @ApiProperty({ description: '属性项名称' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '属性项图片' })
  @IsString()
  @IsOptional()
  image?: string
}

export class UpdateProductSpecInput {
  @ApiProperty({ description: '价格' })
  @IsNumber()
  price: number
}

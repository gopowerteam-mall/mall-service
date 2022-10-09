import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Product } from 'src/entities/product.entity'
import { IdInput } from 'src/shared/typeorm/dto/id.input'
import {
  CreateProductInput,
  FindProductInput,
  UpdateProductInput,
} from '../dtos/product.dto'
import { CategoryService } from '../services/category.service'
import { ProductService } from '../services/product.service'

@Controller('product')
@ApiTags('product')
@ApiSecurity('access-token')
export class ProductController {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  @Get()
  @ApiOperation({ operationId: 'findProduct', summary: '查询商品' })
  @ApiOkResponse({ type: Product, isArray: true })
  findAll(@Query() input: FindProductInput) {
    return this.productService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getProduct', summary: '获取商品' })
  @ApiOkResponse({ type: Product })
  findOne(@Param() {}: IdInput) {
    return
  }

  @Post()
  @ApiOperation({ operationId: 'createProduct', summary: '创建商品' })
  @ApiOkResponse({ type: Product })
  async create(@Body() input: CreateProductInput) {
    const { attrs, specs, categoryId, ...product } = input

    const productAttrs = attrs.map((attr) =>
      this.productService.createProductAttr(attr),
    )

    const productSpecs = specs.map((spec) =>
      this.productService.createProductSpec(spec),
    )

    const category = await this.categoryService.findOne(categoryId)

    return this.productService.create(
      product,
      category,
      productAttrs,
      productSpecs,
    )
  }

  @Put(':id')
  @ApiOperation({ operationId: 'updateProduct', summary: '更新商品' })
  @ApiOkResponse({ type: Product })
  async update(@Param() {}: IdInput, @Body() input: UpdateProductInput) {
    return
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteProduct',
    summary: '删除商品',
  })
  delete(@Param() {}: IdInput) {
    return
  }
}

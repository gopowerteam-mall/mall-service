import { Controller, Get, Param, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { Public } from 'src/decorators/public.decorator'
import { Product } from 'src/entities/product.entity'
import { UUIDInput } from 'src/shared/typeorm/dto/uuid.input'
import { toCursorResponse } from 'src/shared/typeorm/responses/cursor.response'
import { FindProductInput } from '../dtos/product.dto'
import { ProductService } from '../services/product.service'

@Controller('product')
@ApiTags('product')
@ApiSecurity('access-token')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  @ApiOperation({ operationId: 'getProductList', summary: '获取商品列表' })
  @ApiOkResponse({ type: toCursorResponse(Product) })
  findAll(@Query() input: FindProductInput) {
    //     // 构建查询参数
    //     const input = plainToInstance(FindCategoryInput, {})
    //     // 返回查询结果
    //     return this.categoryService.findAll(input.params)
    return this.productService.findAll(input.params)
  }

  @Public()
  @Get(':id')
  @ApiOperation({ operationId: 'getProductList', summary: '获取商品列表' })
  @ApiOkResponse({ type: Product })
  findOne(@Param() input: UUIDInput) {
    //     // 返回查询结果
    return this.productService.findOne(input.id)
  }
}

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
  PublishProductInput,
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

  /**
   * 查询商品列表
   * @param input
   * @returns
   */
  @Get()
  @ApiOperation({ operationId: 'findProduct', summary: '查询商品' })
  @ApiOkResponse({ type: Product, isArray: true })
  findAll(@Query() input: FindProductInput) {
    return this.productService.findAll(input.params)
  }

  /**
   * 查询指定ID商品
   * @param input
   * @returns
   */
  @Get(':id')
  @ApiOperation({ operationId: 'getProduct', summary: '获取商品' })
  @ApiOkResponse({ type: Product })
  findOne(@Param() { id }: IdInput) {
    return this.productService.findOne(id)
  }

  /**
   * 创建商品信息
   * @param input
   */
  @Post()
  @ApiOperation({ operationId: 'createProduct', summary: '创建商品' })
  @ApiOkResponse({ type: Product })
  async create(@Body() input: CreateProductInput) {
    const { categoryId, ...product } = input
    // 获取商品分类
    const category = await this.categoryService.findOne(categoryId)

    return this.productService.create(product, category)
  }

  /**
   * 更新商品信息
   * @param param0
   * @param input
   * @returns
   */
  @Put(':id')
  @ApiOperation({ operationId: 'updateProduct', summary: '更新商品' })
  @ApiOkResponse({ type: Product })
  async update(@Param() { id }: IdInput, @Body() input: UpdateProductInput) {
    const { categoryId, ...product } = input

    const getCategoryInput = async () => {
      // 获取商品分类
      if (categoryId) return await this.categoryService.findOne(categoryId)
    }

    return this.productService.update(id, product, await getCategoryInput())
  }

  /**
   * 商品上架操作
   * @param param0
   * @param input
   * @returns
   */
  @Put('publish/:id/:versionId')
  @ApiOperation({ operationId: 'publishProduct', summary: '上架商品' })
  @ApiOkResponse({ type: Product })
  async publish(@Param() { id, versionId }: PublishProductInput) {
    return this.productService.publish(id, versionId)
  }

  /**
   * 商品下架操作
   * @param param0
   * @param input
   * @returns
   */
  @Put('unpublish/:id')
  @ApiOperation({ operationId: 'unpublishProduct', summary: '下架商品' })
  @ApiOkResponse({ type: Product })
  async unpublish(@Param() { id }: IdInput) {
    return this.productService.unpublish(id)
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

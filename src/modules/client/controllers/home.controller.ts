import { Controller, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { Public } from 'src/decorators/public.decorator'
import { Banner } from 'src/entities/banner.entity'
import { Category } from 'src/entities/category.entity'
import { Product } from 'src/entities/product.entity'
import { FindCategoryInput } from '../dtos/category.dto'
import { FindProductInput } from '../dtos/product.dto'
import { BannerService } from '../services/banner.service'
import { CategoryService } from '../services/category.service'
import { ProductService } from '../services/product.service'

@Controller('home')
@ApiTags('home')
@ApiSecurity('access-token')
export class HomeController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  @Get('get-banner-list')
  @ApiOperation({ operationId: 'getBannerList', summary: '获取Banner列表' })
  @ApiOkResponse({ type: Banner, isArray: true })
  getBannerList() {
    return this.bannerService.findAll()
  }

  @Get('get-category-list')
  @ApiOperation({ operationId: 'getCategoryList', summary: '获取推荐标签列表' })
  @ApiOkResponse({ type: Category, isArray: true })
  getCategoryList() {
    // 构建查询参数
    const input = plainToInstance(FindCategoryInput, { recommended: true })
    // 返回查询结果
    return this.categoryService.findAll(input.params)
  }

  @Get('get-recommend-list')
  @ApiOperation({
    operationId: 'getRecommendList',
    summary: '获取推荐商品',
  })
  @ApiOkResponse({ type: Product, isArray: true })
  getRecommendList() {
    // 构建查询参数
    const input = plainToInstance(FindProductInput, {
      recommended: true,
      size: 4,
    })
    // 返回查询结果
    return this.productService.findAll(input.params)
  }
}

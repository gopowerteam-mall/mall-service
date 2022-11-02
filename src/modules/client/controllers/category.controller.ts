import { Controller, Get } from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { Public } from 'src/decorators/public.decorator'
import { Category } from 'src/entities/category.entity'
import { FindCategoryInput } from '../dtos/category.dto'
import { CategoryService } from '../services/category.service'

@Controller('category')
@ApiTags('category')
@ApiSecurity('access-token')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get('get-category-list')
  @ApiOperation({ operationId: 'getCategoryList', summary: '获取分类列表' })
  @ApiOkResponse({ type: Category, isArray: true })
  getCategoryList() {
    // 构建查询参数
    const input = plainToInstance(FindCategoryInput, {})
    // 返回查询结果
    return this.categoryService.findAll(input.params)
  }

  @Public()
  @Get('get-category-tree')
  @ApiOperation({ operationId: 'getCategoryTree', summary: '获取分类树形结构' })
  @ApiOkResponse({ type: Category, isArray: true })
  getCategoryTree() {
    // 返回查询结果
    return this.categoryService.findRecursion()
  }
}

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
  ApiOperation,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Category } from 'src/entities/category.entity'
import { IdInput } from 'src/shared/typeorm/dto/id.input'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  FindCategoryInput,
} from '../dtos/category.dto'
import { CategoryService } from '../services/category.service'

@Controller('category')
@ApiTags('category')
@ApiSecurity('access-token')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ operationId: 'createCategory', summary: '创建分类' })
  @ApiOkResponse({ type: Category })
  async create(@Body() input: CreateCategoryInput) {
    const parent = input.parentId
      ? await this.categoryService.findOne(input.parentId, {
          children: false,
          parent: false,
        })
      : undefined

    return this.categoryService.create({
      ...input,
      parent,
    })
  }

  @Put(':id')
  @ApiOperation({ operationId: 'updateCategory', summary: '更新分类' })
  @ApiOkResponse({ type: Category })
  async update(@Param() { id }: IdInput, @Body() input: UpdateCategoryInput) {
    const parent = input.parentId
      ? await this.categoryService.findOne(input.parentId, {
          children: false,
          parent: false,
        })
      : undefined

    return this.categoryService.update(id, { ...input, parent })
  }

  @Get()
  @ApiOperation({ operationId: 'findCategory', summary: '查询分类' })
  @ApiOkResponse({ type: Category, isArray: true })
  findAll(@Query() input: FindCategoryInput) {
    if (input.recursion) {
      return this.categoryService.findRecursion()
    } else {
      return this.categoryService.findAll(input.params)
    }
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getCategory', summary: '获取分类' })
  @ApiOkResponse({ type: Category })
  findOne(@Param() { id }: IdInput) {
    return this.categoryService.findOne(id, { children: true, parent: true })
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'removeCategory',
    summary: '删除分类',
  })
  remove(@Param() { id }: IdInput) {
    return this.categoryService.remove(id)
  }
}

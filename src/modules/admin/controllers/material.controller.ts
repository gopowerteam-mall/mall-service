import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Material } from 'src/entities/material.entity'
import { IdsInput } from 'src/shared/typeorm/dto/ids.input'
import { KeyInput } from 'src/shared/typeorm/dto/key.input'
import { CreateMaterialInput, FindMaterialInput } from '../dtos/material.dto'
import { MaterialService } from '../services/material.service'

@Controller('material')
@ApiTags('material')
@ApiSecurity('access-token')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post(':key')
  @ApiOperation({ operationId: 'createMaterial', summary: '创建Material' })
  @ApiOkResponse({ type: Material })
  create(@Param() { key }: KeyInput, @Body() { group }: CreateMaterialInput) {
    return this.materialService.create(key, group)
  }

  @Get()
  @ApiOperation({ operationId: 'findMaterial', summary: '查询Material列表' })
  @ApiOkResponse({ type: Material, isArray: true })
  findAll(@Query() input: FindMaterialInput) {
    return this.materialService.findAll(input.params)
  }

  @Delete('remove-material-batch')
  @ApiOperation({
    operationId: 'removeMaterialBatch',
    summary: '删除素材',
  })
  removeBatch(@Query() { ids }: IdsInput) {
    return this.materialService.removeBatch(ids)
  }

  @Patch('change-group-batch/:ids')
  @ApiOperation({
    operationId: 'changeGroupBatch',
    summary: '修改素材分组',
  })
  changeGroupBatch(@Param() { ids }: IdsInput) {
    return this.materialService.changeGroupBatch(ids)
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { Material } from 'src/entities/material.entity'
import { IdInput } from 'src/shared/typeorm/dto/id.input'
import { IdsInput } from 'src/shared/typeorm/dto/ids.input'
import {
  CreateMaterialGroupInput,
  CreateMaterialInput,
  DeleteMaterialGroupInput,
  FindMaterialInput,
  UpdateMaterialGroupInput,
} from '../dtos/material.dto'
import { MaterialGroupResponse } from '../responses/material.response'
import { MaterialService } from '../services/material.service'

@Controller('material')
@ApiTags('material')
@ApiSecurity('access-token')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiOperation({ operationId: 'createMaterial', summary: '创建素材' })
  @ApiOkResponse({ type: Material, isArray: true })
  create(@Body() { keys, group }: CreateMaterialInput) {
    return this.materialService.create(keys, group)
  }

  @Get()
  @ApiOperation({ operationId: 'findMaterial', summary: '获取素材列表' })
  @ApiOkResponse({ type: Material, isArray: true })
  findAll(@Query() input: FindMaterialInput) {
    return this.materialService.findAll(input.params)
  }

  @Get('group')
  @ApiOperation({
    operationId: 'findMaterialGroup',
    summary: '获取素材分组',
  })
  @ApiOkResponse({ type: MaterialGroupResponse, isArray: true })
  findAllGroup() {
    return this.materialService.findAllGroup()
  }

  @Post('group')
  @ApiOperation({
    operationId: 'createMaterialGroup',
    summary: '创建素材分组',
  })
  @ApiOkResponse({ type: Material })
  createGroup(@Body() { name }: CreateMaterialGroupInput) {
    return this.materialService.createGroup(name)
  }

  @Put('group/:id')
  @ApiOperation({
    operationId: 'updateMaterialGroup',
    summary: '更新素材分组',
  })
  @ApiOkResponse({ type: Material })
  updateGroup(
    @Param() { id }: IdInput,
    @Body() { name }: UpdateMaterialGroupInput,
  ) {
    return this.materialService.updateGroup(id, name)
  }

  @Delete('group/:id')
  @ApiOperation({
    operationId: 'deleteMaterialGroup',
    summary: '删除素材分组',
  })
  @ApiOkResponse({ type: Material })
  deleteGroup(
    @Param() { id }: IdInput,
    @Body() { target }: DeleteMaterialGroupInput,
  ) {
    return this.materialService.deleteGroup(id, target)
  }

  @Delete()
  @ApiOperation({
    operationId: 'deleteMaterialBatch',
    summary: '删除素材',
  })
  deleteBatch(@Query() { ids }: IdsInput) {
    return this.materialService.deleteBatch(ids)
  }

  @Patch('change-group')
  @ApiOperation({
    operationId: 'changeGroupBatch',
    summary: '修改素材分组',
  })
  changeGroupBatch(@Query() { ids }: IdsInput) {
    return this.materialService.changeGroupBatch(ids)
  }
}

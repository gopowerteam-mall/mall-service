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
  ApiOperation,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Banner } from 'src/entities/banner.entity'
import { IdInput } from 'src/shared/typeorm/dto/id.input'
import {
  ChangeBannerOrderInput,
  CreateBannerInput,
  FindBannerInput,
  UpdateBannerInput,
} from '../dtos/banner.dto'
import { BannerService } from '../services/banner.service'

@Controller('banner')
@ApiTags('banner')
@ApiSecurity('access-token')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiOperation({ operationId: 'createBanner', summary: '创建Banner' })
  @ApiOkResponse({ type: Banner })
  create(@Body() input: CreateBannerInput) {
    return this.bannerService.create(input)
  }

  @Put(':id')
  @ApiOperation({ operationId: 'updateBanner', summary: '更新Banner' })
  @ApiOkResponse({ type: Banner })
  update(@Param() { id }: IdInput, @Body() input: UpdateBannerInput) {
    return this.bannerService.update(id, input)
  }

  @Get()
  @ApiOperation({ operationId: 'findBanner', summary: '查询Banner列表' })
  @ApiOkResponse({ type: Banner, isArray: true })
  findAll(@Query() input: FindBannerInput) {
    return this.bannerService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getBanner', summary: '获取Banner' })
  @ApiOkResponse({ type: Banner })
  findOne(@Param() { id }: IdInput) {
    return this.bannerService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'removeBanner',
    summary: '删除Banner',
  })
  remove(@Param() { id }: IdInput) {
    return this.bannerService.remove(id)
  }

  @Patch('change-order/:id')
  @ApiOperation({
    operationId: 'changeBannerOrder',
    summary: '交换Banner位置',
  })
  changeOrder(
    @Param() { id }: IdInput,
    @Body() { target }: ChangeBannerOrderInput,
  ) {
    return this.bannerService.changeOrder(id, target)
  }
}

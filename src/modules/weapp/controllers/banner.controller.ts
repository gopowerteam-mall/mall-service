import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Banner } from 'src/entities/banner.entity'
import { FindBannerInput } from 'src/modules/admin/dtos/banner.dto'
import { BannerService } from '../services/banner.service'

@Controller('banner')
@ApiTags('banner')
@ApiSecurity('access-token')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @ApiOperation({ operationId: 'findBanner', summary: '查询Banner列表' })
  @ApiOkResponse({ type: Banner, isArray: true })
  findAll() {
    return this.bannerService.findAll()
  }
}

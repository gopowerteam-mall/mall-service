import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard'
import { AuthService } from 'src/auth/services/auth.service'
import { Public } from 'src/decorators/public.decorator'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { ConfigService } from '@nestjs/config'
import { AppBaseResponse, TokenResponse } from '../responses/app.response'
import { User } from 'src/entities/user.entity'
import { WeappCodeGuard } from 'src/auth/guards/weapp-code.guard'
import { LoginInput } from '../dtos/app.dto'

@Controller('app')
@ApiTags('app')
@ApiSecurity('access-token')
export class AppController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Get('app-base')
  @ApiOperation({ operationId: 'appBase', summary: '获取系统基本信息' })
  @ApiOkResponse({ type: AppBaseResponse })
  async appBase() {
    const basetime = Date.now()
    return {
      base_time: basetime,
      qiniu: {
        domain: this.config.get('qiniu.storage.main.domain'),
      },
    }
  }

  @Public()
  @Get('weapp-login')
  @ApiOperation({ operationId: 'login', summary: '用户登录' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(WeappCodeGuard)
  login(
    @RequestUser() user: User,
    // eslint-disable-next-line
    @Query() input: LoginInput,
  ) {
    if (user) {
      return this.authService.weappSign(user)
    }
  }

  @Public()
  @Get('weapp-token')
  @ApiOperation({ operationId: 'token', summary: '刷新Token' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(RefreshTokenGuard)
  token(@RequestUser() user: User) {
    if (user) {
      return this.authService.weappSign(user)
    }
  }

  @Get('current')
  @ApiOperation({ operationId: 'getCurrentUser', summary: '获取当前用户信息' })
  @ApiOkResponse({ type: User })
  getCurrentUser(@RequestUser() user: User) {
    return user
  }
}

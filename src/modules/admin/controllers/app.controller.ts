import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { omit } from 'ramda'
import { PasswordAuthGuard } from 'src/auth/guards/password.guard'
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard'
import { AuthService } from 'src/auth/services/auth.service'
import { Public } from 'src/decorators/public.decorator'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { Administrator } from 'src/entities/administrator.entity'
import { LoginInput } from '../dtos/administrator.dto'
import { AppInitInput } from '../dtos/app.dto'
import { AdministratorService } from '../services/administrator.service'
import { AppBaseResponse, TokenResponse } from '../responses/app.response'
import { ConfigService } from '@nestjs/config'

@Controller('app')
@ApiTags('app')
@ApiSecurity('access-token')
export class AppController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly administratorService: AdministratorService,
  ) {}

  @Public()
  @Post('app-init')
  @ApiOperation({ operationId: 'appInit', summary: '系统初始化' })
  async appInit(@Body() { administrator }: AppInitInput) {
    const count = await this.administratorService.countAdministrator()

    if (count !== 0) {
      return new HttpException(
        '系统已进行过初始化配置',
        HttpStatus.EXPECTATION_FAILED,
      )
    }

    // 添加初始管理员
    await this.administratorService.create(
      administrator.username,
      administrator.password,
    )
  }

  @Public()
  @Get('app-base')
  @ApiOperation({ operationId: 'appBase', summary: '获取系统基本信息' })
  @ApiOkResponse({ type: AppBaseResponse })
  async appBase() {
    // 获取系统管理员数量
    const count = await this.administratorService.countAdministrator()

    if (count === 0) {
      throw new HttpException(
        {
          message: '系统需要进行初始化配置',
          ready: false,
        },
        HttpStatus.EXPECTATION_FAILED,
      )
    }

    const basetime = Date.now()
    // TODO: 返回七牛信息
    return {
      base_time: basetime,
      qiniu: {
        domain: this.config.get('qiniu.storage.main.domain'),
      },
      ready: count > 0,
    }
  }

  @Public()
  @Post('login')
  @UseGuards(PasswordAuthGuard)
  @ApiOperation({ operationId: 'login', summary: '管理员登录' })
  @ApiOkResponse({ type: TokenResponse })
  login(
    @RequestUser() administrator: Administrator,
    @Body() loginInput: LoginInput,
  ) {
    if (loginInput.username === administrator.username) {
      return this.authService.adminSign(administrator)
    }
  }

  @Public()
  @Get('token')
  @ApiOperation({ operationId: 'token', summary: '刷新Token' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(RefreshTokenGuard)
  token(@RequestUser() administrator: Administrator) {
    if (administrator) {
      return this.authService.adminSign(administrator)
    }
  }

  @Get('current-user')
  @ApiOperation({ operationId: 'getCurrentUser', summary: '获取当前用户信息' })
  @ApiOkResponse({ type: Administrator })
  getCurrentUser(@RequestUser() administrator: Administrator) {
    return omit(['password'], administrator)
  }
}

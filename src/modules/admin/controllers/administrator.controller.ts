import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { omit } from 'ramda'
import { AuthService } from 'src/auth/services/auth.service'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { Administrator } from 'src/entities/administrator.entity'
import { IdInput } from 'src/shared/typeorm/dto/id.input'
import {
  CreateAdministratorInput,
  UpdatePasswordInput,
  UpdateAdministratorInput,
  FindAdministratorInput,
} from '../dtos/administrator.dto'
import { AdministratorResetPasswordResponse } from '../responses/administrator.response'
import { AdministratorService } from '../services/administrator.service'

@Controller('administrator')
@ApiTags('administrator')
@ApiSecurity('access-token')
export class AdministratorController {
  constructor(
    private administratorService: AdministratorService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ operationId: 'createAdministrator', summary: '创建管理员' })
  @ApiOkResponse({ type: Administrator })
  create(@Body() createAdministratorInput: CreateAdministratorInput) {
    const administrator = this.administratorService.create(
      createAdministratorInput.username,
      createAdministratorInput.password,
    )

    return omit(['password'], administrator)
  }

  @Put(':id')
  @ApiOperation({ operationId: 'updateAdministrator', summary: '更新管理员' })
  @ApiOkResponse({ type: Administrator })
  update(
    @Param() { id }: IdInput,
    @Body() updateAdministratorInput: UpdateAdministratorInput,
  ) {
    return this.administratorService.update(id, updateAdministratorInput)
  }

  @Get()
  @ApiOperation({ operationId: 'findAdministrator', summary: '查询管理员列表' })
  @ApiOkResponse({ type: Administrator, isArray: true })
  findAll(@Query() input: FindAdministratorInput) {
    return this.administratorService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getAdministrator', summary: '获取管理员' })
  @ApiOkResponse({ type: Administrator })
  findOne(@Param() { id }: IdInput) {
    return this.administratorService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'removeAdministrator',
    summary: '删除用户',
  })
  remove(@Param() { id }: IdInput) {
    return this.administratorService.remove(id)
  }

  @Patch('reset-password/:id')
  @ApiOperation({
    operationId: 'resetAdministratorPassword',
    summary: '重置管理员密码',
  })
  @ApiOkResponse({ type: AdministratorResetPasswordResponse })
  async resetPassword(@Param() { id }: IdInput) {
    // 重置密码
    const password = await this.administratorService.resetAdministratorPassword(
      id,
    )

    return {
      password,
    }
  }

  @Patch('update-password/:id')
  @ApiOperation({
    operationId: 'updateAdministratorPassword',
    summary: '更新管理员密码',
  })
  async updatePassword(
    @RequestUser() administrator: Administrator,
    @Param() { id }: IdInput,
    @Body() { oldPassword, newPassword }: UpdatePasswordInput,
  ) {
    if (administrator.id !== id) {
      throw new HttpException('无法修改非当前用户密码', HttpStatus.BAD_REQUEST)
    }

    if (
      !this.authService.comparePassword(oldPassword, administrator.password)
    ) {
      throw new HttpException('原密码错误', HttpStatus.BAD_REQUEST)
    }

    return this.administratorService.updateAdministratorPassword(
      id,
      newPassword,
    )
  }
}

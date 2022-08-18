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
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { AuthService } from 'src/auth/services/auth.service'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { Admin } from 'src/entities/admin.entity'
import { IdInput } from 'src/shared/typeorm/dto/id.input'
import {
  CreateAdminInput,
  UpdatePasswordInput,
  UpdateAdminInput,
} from '../dtos/admin.dto'
import { AdminResetPasswordResponse } from '../responses/admin.response'
import { AdminService } from '../services/admin.service'

@Controller('admin')
@ApiTags('admin')
@ApiSecurity('access-token')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ operationId: 'createAdmin', summary: '创建管理员' })
  @ApiOkResponse({ type: Admin })
  create(@Body() createAdminInput: CreateAdminInput) {
    return this.adminService.create(
      createAdminInput.username,
      createAdminInput.password,
    )
  }

  @Put(':id')
  @ApiOperation({ operationId: 'updateAdmin', summary: '更新管理员' })
  @ApiOkResponse({ type: Admin })
  update(@Param() { id }: IdInput, @Body() updateAdminInput: UpdateAdminInput) {
    return this.adminService.update(id, updateAdminInput)
  }

  @Get()
  @ApiOperation({ operationId: 'findAdmin', summary: '查询管理员' })
  @ApiOkResponse({ type: Admin, isArray: true })
  findAll() {
    return this.adminService.findAll()
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getAdmin', summary: '获取管理员' })
  @ApiOkResponse({ type: Admin })
  findOne(@Param() { id }: IdInput) {
    return this.adminService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'removeAdmin',
    summary: '删除用户',
  })
  remove(@Param() { id }: IdInput) {
    return this.adminService.remove(id)
  }

  @Patch('reset-password/:id')
  @ApiOperation({
    operationId: 'resetAdminPassword',
    summary: '重置管理员密码',
  })
  @ApiOkResponse({ type: AdminResetPasswordResponse })
  async resetPassword(@Param() { id }: IdInput) {
    // 重置密码
    const password = await this.adminService.resetAdminPassword(id)

    return {
      password,
    }
  }

  @Patch('update-password/:id')
  @ApiOperation({
    operationId: 'updateAdminPassword',
    summary: '更新管理员密码',
  })
  async updatePassword(
    @RequestUser() admin: Admin,
    @Param() { id }: IdInput,
    @Body() { oldPassword, newPassword }: UpdatePasswordInput,
  ) {
    if (admin.id !== id) {
      throw new HttpException('无法修改非当前用户密码', HttpStatus.BAD_REQUEST)
    }

    if (!this.authService.comparePassword(oldPassword, admin.password)) {
      throw new HttpException('原密码错误', HttpStatus.BAD_REQUEST)
    }

    return this.adminService.updateAdminPassword(id, newPassword)
  }
}

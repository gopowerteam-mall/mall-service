import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { PasswordAuthGuard } from 'src/auth/guards/password.guard'
import { AuthService } from 'src/auth/services/auth.service'
import { Public } from 'src/decorators/public.decorator'
import { LoginDTO } from '../dtos/admin.dto'

@Controller('admin')
@ApiTags('admin')
export class AdminController {}

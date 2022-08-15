import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('admin/user')
@ApiTags('user')
export class UserController {}

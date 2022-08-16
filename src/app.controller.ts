import { Controller, Get } from '@nestjs/common'
import { Public } from './decorators/public.decorator'

@Controller()
export class AppController {
  @Get()
  @Public()
  async index() {
    return 'everything is OK'
  }
}

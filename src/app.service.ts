import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getHello() {
    const count = ((await this.cacheManager.get<number>('count')) || 0) + 1
    this.cacheManager.set('count', count)

    return `第${count}次请求!`
  }
}

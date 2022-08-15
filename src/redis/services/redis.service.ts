import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'

@Injectable()
export class RedisService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      ...this.configService.get('redis'),
      ttl: 60 * 60 * 24,
    }
  }
}

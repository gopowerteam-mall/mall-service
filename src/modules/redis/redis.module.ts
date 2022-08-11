import { CacheModule, Module } from '@nestjs/common'
import { RedisService } from './services/redis.service'

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: RedisService,
      isGlobal: true,
    }),
  ],
})
export class RedisModule {}

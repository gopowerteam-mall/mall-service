import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    // 获取数据库配置
    const options = await this.configService.get('database')

    return {
      ...options,
      // 开启数据库日志
      logger: true,
      // 自动加载实体
      autoLoadEntities: true,
      // 同步表结构
      synchronize: true,
      // 记录sql
      logging: 'all',
    }
  }
}

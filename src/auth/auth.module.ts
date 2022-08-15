import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PasswordStrategy } from './strategy/password.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from 'src/entities/admin.entity'
import { User } from 'src/entities/user.entity'
import { AuthService } from './services/auth.service'
import { AccessTokenStrategy } from './strategy/access-token.strategy'
import { APP_GUARD } from '@nestjs/core'
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy'
import { AccessTokenAuthGuard } from './guards/access-token.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([Admin, User]),
  ],
  providers: [
    PasswordStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}

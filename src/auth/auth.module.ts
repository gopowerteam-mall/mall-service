import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { PasswordStrategy } from './strategy/password.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Administrator } from 'src/entities/administrator.entity'
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
    TypeOrmModule.forFeature([Administrator, User]),
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

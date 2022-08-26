import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JWTOrigin } from 'src/config/enum.config'
import { AuthService } from '../services/auth.service'
import type { Cache } from 'cache-manager'
import { Administrator } from 'src/entities/administrator.entity'
import { User } from 'src/entities/user.entity'

type JwtPayload = {
  id: string
  username?: string
  openid?: string
  origin: JWTOrigin
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: config.get('jwt.refreshTokenSecret'),
    })
  }

  async validate(req, payload: JwtPayload) {
    const getTargetUser = (): Promise<User | Administrator | undefined> => {
      switch (payload.origin) {
        case JWTOrigin.Admin:
          return this.authService.getAdminUser(payload.id, payload.username)
        case JWTOrigin.Weapp:
          return this.authService.getWeappUser(payload.id, payload.username)
      }
    }

    // 获取登录用户
    const user = await getTargetUser()

    const authorization = req.headers?.authorization || ''
    const [token] = authorization.match(/(?<=\Bearer\s)(.*)/)

    if ((await this.cacheManager.get(user?.id)) !== token) {
      throw new UnauthorizedException('不存在的RefreshToken')
    }

    if (user) {
      return user
    }
  }
}

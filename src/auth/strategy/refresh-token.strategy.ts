import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TokenOrigin } from 'src/config/enum.config'
import { AuthService } from '../services/auth.service'
import type { Cache } from 'cache-manager'
import { Admin } from 'src/entities/admin.entity'
import { User } from 'src/entities/user.entity'

type JwtPayload = {
  id: string
  username?: string
  openid?: string
  origin: TokenOrigin
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
    const getTargetUser = (): Promise<User | Admin | undefined> => {
      switch (payload.origin) {
        case TokenOrigin.Admin:
          return this.authService.getAdminUser(payload.id, payload.username)
        case TokenOrigin.Weapp:
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

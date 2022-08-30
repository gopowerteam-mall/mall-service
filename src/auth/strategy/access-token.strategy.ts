import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JWTOrigin } from 'src/config/enum.config'
import { AuthService } from '../services/auth.service'

type JwtPayload = {
  id: string
  username?: string
  openid?: string
  origin: JWTOrigin
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt.accessTokenSecret'),
    })
  }

  /**
   * 验证用户
   * @param payload
   * @returns
   */
  async validate(payload: JwtPayload) {
    const getTargetUser = () => {
      switch (payload.origin) {
        case JWTOrigin.Admin:
          return this.authService.getAdminUser(payload.id, payload.username)
        case JWTOrigin.Weapp:
          return this.authService.getWeappUser(payload.id)
      }
    }

    // 获取登录用户
    const user = await getTargetUser()

    if (user) {
      return user
    }
  }
}

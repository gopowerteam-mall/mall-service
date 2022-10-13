import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { Strategy } from 'passport-custom'

@Injectable()
export class WeappCodeStrategy extends PassportStrategy(
  Strategy,
  'weapp-code',
) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(req): Promise<any> {
    // 小程序登陆码 - code
    const code = req.query?.code
    // 用户登录
    const user = this.authService.weappLogin(code)

    if (user) {
      return user
    }
  }
}

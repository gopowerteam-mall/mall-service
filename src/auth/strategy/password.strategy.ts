import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../services/auth.service'

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy, 'password') {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const admin = await this.authService.adminLogin(username, password)

    if (admin) {
      return admin
    }
  }
}

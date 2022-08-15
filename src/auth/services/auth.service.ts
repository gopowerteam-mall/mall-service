import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Admin } from 'src/entities/admin.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { TokenOrigin } from 'src/config/enum.config'
import { Cache } from 'cache-manager'

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * 管理员登录
   * @param username
   * @param password
   */
  async adminLogin(username: string, password: string) {
    const admin = await this.adminRepository.findOne({
      where: {
        username,
      },
    })

    if (!admin) {
      throw new UnauthorizedException('用户不存在')
    }

    if (!bcrypt.compareSync(password, admin.password)) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    return admin
  }

  /**
   * 管理端用户登录
   * @param admin
   * @returns
   */
  async getAdminUser(id: string, username: string) {
    return await this.adminRepository.findOne({
      where: {
        id,
        username,
      },
    })
  }

  /**
   * 管理端用户登录
   * @param admin
   * @returns
   */
  async getWeappUser(id: string, openid: string) {
    return undefined
  }

  /**
   * 小程序用户登录
   * @param user
   * @returns
   */
  async weappValidate(user: any) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  /**
   * 管理员签名
   * @param admin
   * @returns
   */
  async adminSign(admin: Admin) {
    const tokenOrigin = TokenOrigin.Admin

    const payload = {
      username: admin.username,
      id: admin.id,
      origin: tokenOrigin,
    }

    const accessTokenExpiresIn = 60 * 60 * 1
    const refreshTokenExpiresIn = 60 * 60 * 7
    // 获取AccessToken
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.accessTokenSecret'),
      expiresIn: accessTokenExpiresIn,
    })

    // 获取AccessToken
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.refreshTokenSecret'),
      expiresIn: refreshTokenExpiresIn,
    })

    // 缓存AccessToken
    await this.cacheManager.set(admin.id, refreshToken, {
      ttl: refreshTokenExpiresIn,
    })

    // 返回认证信息
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: accessTokenExpiresIn,
      token_origin: tokenOrigin,
    }
  }
}

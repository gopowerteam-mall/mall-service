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
import { JWTOrigin } from 'src/config/enum.config'
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
   * 获取密码HASH
   * @param password
   * @returns
   */
  public async hashPassword(password: string) {
    const saltRounds = this.config.get<string>('app.saltRounds')
    const hash = await bcrypt.hash(password, parseInt(saltRounds))

    return hash
  }

  /**
   * 比较密码
   * @param password
   * @param value
   */
  public comparePassword(password1, password2) {
    return bcrypt.compareSync(password1, password2)
  }

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

    if (!this.comparePassword(password, admin.password)) {
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
    const jwtOrigin = JWTOrigin.Admin

    const payload = {
      username: admin.username,
      id: admin.id,
      origin: jwtOrigin,
    }

    const accessTokenExpiresIn = 60 * 60 * 1
    const refreshTokenExpiresIn = 60 * 60 * 24 * 7

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
      token_origin: jwtOrigin,
    }
  }
}

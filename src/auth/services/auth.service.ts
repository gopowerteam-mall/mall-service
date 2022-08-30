import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Administrator } from 'src/entities/administrator.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { JWTOrigin } from 'src/config/enum.config'
import { Cache } from 'cache-manager'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { nanoid } from 'nanoid/non-secure'

const WEAPP_API = {
  token: 'https://api.weixin.qq.com/cgi-bin/token',
  code2session: 'https://api.weixin.qq.com/sns/jscode2session',
  getuserphonenumber:
    'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
}

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
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
    const admin = await this.administratorRepository.findOne({
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
    return await this.administratorRepository.findOne({
      where: {
        id,
        username,
      },
    })
  }

  /**
   * 管理员签名
   * @param admin
   * @returns
   */
  async adminSign(administrator: Administrator) {
    const jwtOrigin = JWTOrigin.Admin

    const payload = {
      username: administrator.username,
      id: administrator.id,
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
    await this.cacheManager.set(administrator.id, refreshToken, {
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

  /**
   * 管理员登录
   * @param username
   * @param password
   */
  async weappLogin(code: string) {
    // 获取openid
    const {
      data: { errcode, errmsg, openid },
    } = await lastValueFrom(
      this.httpService.get(WEAPP_API.code2session, {
        params: {
          code,
          grant_type: 'authorization_code',
          appid: this.config.get('weapp.appid'),
          secret: this.config.get('weapp.secret'),
        },
      }),
    )

    if (errcode) {
      throw new Error(errmsg)
    }

    const user = await this.userRepository.findOneBy({
      openid,
    })

    if (user) {
      return user
    }

    // 创建用户
    return this.userRepository.save(
      {
        openid,
        nickname: `用户${nanoid(8)}`,
      },
      { reload: true },
    )
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
  async weappSign(user: User) {
    const jwtOrigin = JWTOrigin.Weapp

    const payload = {
      id: user.id,
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
    await this.cacheManager.set(user.id, refreshToken, {
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

  public async getWeappUser(id: string) {
    return await this.userRepository.findOneBy({
      id,
    })
  }
}

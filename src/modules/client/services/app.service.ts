import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

const WEAPP_API = {
  token: 'https://api.weixin.qq.com/cgi-bin/token',
  code2session: 'https://api.weixin.qq.com/sns/jscode2session',
  getuserphonenumber:
    'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
}

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  /**
   * 获取AccessToken
   */
  private getAccessToken() {
    return this.httpService.get(WEAPP_API.token)
  }

  /**
   * 获取Session
   * @returns
   */
  private codeToSession(code: string) {
    return this.httpService.get(WEAPP_API.code2session)
  }

  /**
   * 解密用户信息
   */
  public decryptUserInfo() {
    this.httpService.get(WEAPP_API.token)
  }
}

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as qiniu from 'qiniu'

@Injectable()
export class TokenService {
  constructor(private readonly config: ConfigService) {}

  /**
   * 获取Token
   */
  public getUploadToken() {
    const storage = this.config.get('qiniu.storage')
    const sign = this.getSign()

    const options = {
      scope: storage.temp.bucket,
      expires: 60 * 60 * 2,
    }

    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(sign)

    return uploadToken
  }

  /**
   * 获取签名
   * @returns
   */
  public getSign() {
    const accessKey = this.config.get('qiniu.accessKey')
    const secretKey = this.config.get('qiniu.secretKey')

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    return mac
  }
}

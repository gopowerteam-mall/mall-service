import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as qiniu from 'qiniu'
import { TokenService } from './token.service'

@Injectable()
export class FileService {
  constructor(
    private readonly config: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * 获取BucketManager
   * @returns
   */
  private getBucketManager() {
    const sign = this.tokenService.getSign()

    return new qiniu.rs.BucketManager(
      sign,
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z2,
      }),
    )
  }

  /**
   * 保存文件
   * @param key
   */
  public save(key: string) {
    const tempBucket = this.config.get('qiniu.storage.temp.bucket')
    const mainBucket = this.config.get('qiniu.storage.main.bucket')

    const bucketManager = this.getBucketManager()

    return new Promise<void>((resolve, reject) => {
      bucketManager.copy(
        tempBucket,
        key,
        mainBucket,
        key,
        { force: true },
        (err) => {
          if (err) {
            return reject()
          }

          // 待测试
          resolve()
        },
      )
    })
  }
}

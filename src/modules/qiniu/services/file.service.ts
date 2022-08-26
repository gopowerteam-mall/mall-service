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

  public listFile(bucket: string, prefix: string) {
    const bucketManager = this.getBucketManager()

    return new Promise<any[]>((resolve) =>
      bucketManager.listPrefix(bucket, { prefix }, (_, files) => {
        return resolve(files.items)
      }),
    )
  }

  /**
   * 保存文件
   * @param key
   */
  public async save(key: string) {
    const tempBucket = this.config.get('qiniu.storage.temp.bucket')
    const mainBucket = this.config.get('qiniu.storage.main.bucket')

    const [mainFile] = await this.listFile(tempBucket, key)
    const [tempFile] = await this.listFile(mainBucket, key)

    if (!mainFile && !tempFile) {
      throw new Error('无法找到需要保存的文件')
    }

    if (!mainFile) {
      // 文件已存在
      return
    }

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

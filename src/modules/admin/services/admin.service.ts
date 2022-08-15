import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Admin } from 'src/entities/admin.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async addAdmin(username: string, password: string) {
    const saltRounds = this.configService.get<string>('app.saltRounds')
    const hash = await bcrypt.hash(password, parseInt(saltRounds))

    const admin = this.adminRepository.create({
      username,
      password: hash,
    })

    return admin.save({ reload: true })
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async deleteAdmin(id: string) {
    const admin = await this.adminRepository.preload({ id })
    return admin.remove({})
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async resetAdmin(id: string) {
    const admin = await this.adminRepository.preload({ id })
    admin.password = Math.random().toString(36).slice(-6)
    return admin.save({ reload: true })
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async countAdmin() {
    return await this.adminRepository.count()
  }
}

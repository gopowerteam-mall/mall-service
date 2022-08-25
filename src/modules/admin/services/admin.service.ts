import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthService } from 'src/auth/services/auth.service'
import { PaginatorMode } from 'src/config/enum.config'
import { Admin } from 'src/entities/admin.entity'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { buildPaginator } from 'src/shared/typeorm/query/paginator'
import { Repository } from 'typeorm'

@Injectable()
export class AdminService {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async create(username: string, password: string) {
    const hash = await this.authService.hashPassword(password)

    const admin = this.adminRepository.create({
      username,
      password: hash,
    })

    return admin.save({ reload: true })
  }

  /**
   * 删除管理员
   * @returns
   */
  public async remove(id: string) {
    const admin = await this.adminRepository.preload({ id })

    if (admin) {
      return admin.remove()
    }
  }

  /**
   * 查找管理员
   * @returns
   */
  findAll({ buildWhereQuery, page, order }: QueryInputParam<Admin>) {
    const builder = this.adminRepository.createQueryBuilder('admin')

    builder.andWhere(buildWhereQuery())

    const paginator = buildPaginator({
      mode: PaginatorMode.index,
      entity: Admin,
      query: {
        order: order,
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  /**
   * 获取管理员
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.adminRepository.findOneBy({ id })
  }

  /**
   * 更新管理员
   * @param id
   * @param updateTestDto
   * @returns
   */
  update(id: string, input: Partial<Admin>) {
    return this.adminRepository.update(id, input)
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async resetAdminPassword(id: string) {
    // 生成随机密码
    const password = Math.random().toString(36).slice(-6)

    const hash = await this.authService.hashPassword(password)

    await this.adminRepository.update(id, {
      password: hash,
    })

    return password
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async updateAdminPassword(id: string, password: string) {
    // 生成随机密码
    const hash = await this.authService.hashPassword(password)

    await this.adminRepository.update(id, {
      password: hash,
    })
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

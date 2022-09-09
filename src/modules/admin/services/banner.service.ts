import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from 'src/config/enum.config'
import { Banner } from 'src/entities/banner.entity'
import { FileService } from 'src/modules/qiniu/services/file.service'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { In, Repository } from 'typeorm'
import { CreateBannerInput, UpdateBannerInput } from '../dtos/banner.dto'

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    private readonly fileService: FileService,
  ) {}

  /**
   * 添加Banner
   * @param username
   * @param password
   * @returns
   */
  async create(input: CreateBannerInput) {
    // 保存图片
    await this.fileService.save(input.image)

    const banner = this.bannerRepository.create({
      ...input,
    })

    return banner.save({ reload: true })
  }

  /**
   * 删除Banner
   * @returns
   */
  async delete(id: string) {
    return await this.bannerRepository.delete(id)
  }

  /**
   * 查找Banner
   * @returns
   */
  findAll({ buildWhereQuery }: QueryInputParam<Banner>) {
    const builder = this.bannerRepository.createQueryBuilder('admin')

    builder.andWhere(buildWhereQuery())
    builder.orderBy('sort', Order.ASC)

    return builder.getMany()
  }

  /**
   * 获取Banner
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.bannerRepository.findOneBy({ id })
  }

  /**
   * 更新Banner
   * @param id
   * @param updateTestDto
   * @returns
   */
  async update(id: string, input: UpdateBannerInput) {
    // 保存图片
    if (input?.image) {
      await this.fileService.save(input.image)
    }

    return this.bannerRepository.update(id, input)
  }

  /**
   * 更新排序
   * @param id
   * @param target
   * @returns
   */
  async changeOrder(id: string, target: string) {
    const [before, after] = await this.bannerRepository.findBy({
      id: In([id, target]),
    })

    if (!before || !after) {
      return new Error('目标对象不存在')
    }

    // 交换元素位置
    const [afterSort, beforeSort] = [before.sort, after.sort]

    before.sort = beforeSort
    after.sort = afterSort

    // 更新元素位置
    this.bannerRepository.save([after, before])
  }
}

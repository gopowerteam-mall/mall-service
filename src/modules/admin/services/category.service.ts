import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'ramda'
import { Order } from 'src/config/enum.config'
import { Category } from 'src/entities/category.entity'
import { FileService } from 'src/modules/qiniu/services/file.service'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { Repository } from 'typeorm'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/category.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly fileService: FileService,
  ) {}
  /**
   * 添加Category
   * @param username
   * @param password
   * @returns
   */
  async create(input: Partial<Category>) {
    // 保存图片
    if (input.image) {
      await this.fileService.save(input.image)
    }

    // 创建分类
    const category = this.categoryRepository.create(input)

    // 设置父分类
    return category.save({ reload: true })
  }

  /**
   * 删除Category
   * @returns
   */
  async remove(id: string) {
    const category = await this.categoryRepository.preload({ id })

    if (category) {
      return category.remove()
    }
  }

  /**
   * 查找Category
   * @returns
   */
  findAll({ buildWhereQuery }: QueryInputParam<Category>) {
    const builder = this.categoryRepository.createQueryBuilder('category')

    builder.andWhere(buildWhereQuery())

    return builder.getMany()
  }

  /**
   * 获取Category
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.categoryRepository.findOneBy({ id })
  }

  /**
   * 更新Category
   * @param id
   * @param updateTestDto
   * @returns
   */
  async update(id: string, input: Partial<Category>) {
    // 保存图片
    if (input?.image) {
      await this.fileService.save(input.image)
    }

    return this.categoryRepository.update(id, input)
  }
}

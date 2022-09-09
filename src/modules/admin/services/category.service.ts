import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from 'src/entities/category.entity'
import { FileService } from 'src/modules/qiniu/services/file.service'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { Repository, TreeRepository } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Category)
    private readonly categoryTreeRepository: TreeRepository<Category>,

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
  async delete(id: string) {
    return this.categoryRepository.delete(id)
  }

  /**
   * 查找Category
   * @returns
   */
  async findAll({ buildWhereQuery }: QueryInputParam<Category>) {
    const builder = this.categoryRepository.createQueryBuilder('category')

    builder
      .andWhere(buildWhereQuery())
      .leftJoinAndSelect('category.parent', 'parent')

    return builder.getMany()
  }

  /**
   * 查找Category
   * @returns
   */
  findRecursion() {
    return this.categoryTreeRepository.findTrees()
  }

  /**
   * 获取Category
   * @param id
   * @returns
   */
  findOne(id: string, relations = { children: true, parent: false }) {
    return this.categoryRepository.findOne({
      where: { id },
      relations,
    })
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

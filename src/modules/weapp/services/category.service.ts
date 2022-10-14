import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from 'src/entities/category.entity'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { Repository, TreeRepository } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Category)
    private readonly categoryTreeRepository: TreeRepository<Category>,
  ) {}

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
}

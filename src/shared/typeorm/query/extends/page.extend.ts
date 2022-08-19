import { FindManyOptions, Repository } from 'typeorm'
import { Pageable } from '../../responses/page.response'
import { PageParams } from '../params/page-params'

/**
 * 添加分页支持
 * @param this
 * @returns
 */

export default {
  pagination: async function <T>(
    this: Repository<T>,
    options?: FindManyOptions<T>,
    {
      page,
    }: {
      page?: PageParams
    } = {},
  ): Promise<Pageable<T> | T[]> {
    if (page) {
      // 进行分页查找
      const [data, count] = await this.findAndCount({
        ...options,
        take: page.take,
        skip: page.skip,
      })

      return new Pageable(data, count, page)
    } else {
      return this.find({ ...options })
    }
  },
}

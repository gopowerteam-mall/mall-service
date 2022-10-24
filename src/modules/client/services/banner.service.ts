import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from 'src/config/enum.config'
import { Banner } from 'src/entities/banner.entity'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { Repository } from 'typeorm'

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  /**
   * 查找Banner
   * @returns
   */
  findAll() {
    const builder = this.bannerRepository.createQueryBuilder('admin')

    builder.orderBy('sort', Order.ASC)

    return builder.getMany()
  }
}

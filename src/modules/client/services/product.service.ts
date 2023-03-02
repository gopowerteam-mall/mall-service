import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { PaginatorMode } from 'src/config/enum.config'
import { ProductAttrItem } from 'src/entities/product-attr-item.entity'
import { ProductAttr } from 'src/entities/product-attr.entity'
import { ProductSpec } from 'src/entities/product-spec.entity'
import { Product } from 'src/entities/product.entity'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { buildPaginator } from 'src/shared/typeorm/query/paginator'
import { Repository, DataSource } from 'typeorm'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductAttr)
    private readonly productAttrRepository: Repository<ProductAttr>,
    @InjectRepository(ProductAttrItem)
    private readonly productAttrItemRepository: Repository<ProductAttrItem>,
    @InjectRepository(ProductSpec)
    private readonly productSpecRepository: Repository<ProductSpec>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * 查询推荐商品列表
   */
  public async findAll({ buildWhereQuery, cursor }: QueryInputParam<Product>) {
    const builder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.versions', 'version')
      .leftJoinAndSelect('version.attrs', 'attr')
      .leftJoinAndSelect('version.specs', 'spec')
      .leftJoinAndSelect('attr.items', 'attr_item')
      .leftJoinAndSelect('spec.items', 'spec_item')

    builder.andWhere(buildWhereQuery())
    builder.andWhere({ enable: true })

    const paginator = buildPaginator({
      mode: PaginatorMode.Cursor,
      entity: Product,
      query: {
        cursor: cursor.cursor,
        limit: cursor.limit,
      },
      cursorKey: cursor.cursorKey,
      orderKey: cursor.orderKey,
    })

    return paginator.paginate(builder)
  }

  /**
   * 查询商品详情
   */
  public findOne(id: string) {
    const builder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.versions', 'version')
      .leftJoinAndSelect('version.attrs', 'attr')
      .leftJoinAndSelect('version.specs', 'spec')
      .leftJoinAndSelect('attr.items', 'attr_item')
      .leftJoinAndSelect('spec.items', 'spec_item')
      .where('product.id = :id', { id })

    return builder.getOne()
  }
}

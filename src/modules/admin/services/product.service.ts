import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { PaginatorMode } from 'src/config/enum.config'
import { Category } from 'src/entities/category.entity'
import { ProductAttrItem } from 'src/entities/product-attr-item.entity'
import { ProductAttr } from 'src/entities/product-attr.entity'
import { ProductSpec } from 'src/entities/product-spec.entity'
import { Product } from 'src/entities/product.entity'
import { FileService } from 'src/modules/qiniu/services/file.service'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { buildPaginator } from 'src/shared/typeorm/query/paginator'
import { DataSource, Repository } from 'typeorm'
import {
  CreateProductAttrInput,
  createProductSpecInput,
} from '../dtos/product.dto'

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
    private fileService: FileService,
  ) {}

  /**
   * 查询商品列表
   */
  public async findAll({
    buildWhereQuery,
    page,
    order,
  }: QueryInputParam<Product>) {
    const builder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.attrs', 'attrs')
      .leftJoinAndSelect('attrs.items', 'items')
      .leftJoinAndSelect('product.specs', 'specs')

    builder.andWhere(buildWhereQuery())

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: Product,
      query: {
        order: order,
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  /**
   * 查询商品详情
   */
  public findOne(id: string) {
    const builder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.attrs', 'attrs')
      .leftJoinAndSelect('attrs.items', 'items')
      .leftJoinAndSelect('product.specs', 'specs')

    builder.andWhere(`product.id = :id`, {
      id,
    })

    return builder.getOne()
  }

  /**
   * 创建商品
   * @returns
   */
  public async create(
    productInput: Partial<Product>,
    category: Category,
    attrs: ProductAttr[],
    specs: ProductSpec[],
  ) {
    // 保存图片
    await this.saveProductImages(productInput)

    // 创建商品
    const product = this.productRepository.create({
      ...productInput,
      category,
    })

    await this.dataSource.manager.transaction(async (manager) => {
      attrs.forEach(async ({ items }) => await manager.save(items))

      product.attrs = await manager.save(attrs)
      product.specs = await manager.save(specs)

      return await manager.save(product, { reload: true })
    })
  }

  /**
   * 更新商品
   * @returns
   */
  public update() {
    return
  }

  /**
   * 删除商品
   * @returns
   */
  public delete() {
    return
  }

  /**
   * 创建商品属性
   */
  public createProductAttr(attr: CreateProductAttrInput) {
    const items = attr.items.map((item) =>
      this.productAttrItemRepository.create(item),
    )

    return this.productAttrRepository.create({
      name: attr.name,
      primary: attr.primary,
      items,
    })
  }

  /**
   * 创建商品Spec
   */
  public createProductSpec(spac: createProductSpecInput) {
    return this.productSpecRepository.create(spac)
  }

  private async saveProductImages(product: Partial<Product>) {
    // 保存图片封面
    if (product.cover) {
      await this.fileService.save(product.cover)
    }

    // 保存Banner图片
    if (product.banners) {
      await Promise.all(
        product.banners.map((banner) => this.fileService.save(banner)),
      )
    }
    // 保存内容图片
    if (product.contents) {
      await Promise.all(
        product.contents.map((content) => this.fileService.save(content)),
      )
    }
  }
}

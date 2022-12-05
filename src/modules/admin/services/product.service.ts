import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { where } from 'ramda'
import { PaginatorMode } from 'src/config/enum.config'
import { Category } from 'src/entities/category.entity'
import { ProductAttrItem } from 'src/entities/product-attr-item.entity'
import { ProductAttr } from 'src/entities/product-attr.entity'
import { ProductSpec } from 'src/entities/product-spec.entity'
import { ProductVersion } from 'src/entities/product-version.entity'
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
    @InjectRepository(ProductVersion)
    private readonly productVersionRepository: Repository<ProductVersion>,
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
    // const builder = this.productRepository
    //   .createQueryBuilder('product')
    //   .leftJoinAndSelect('product.attrs', 'attrs')
    //   .leftJoinAndSelect('attrs.items', 'items')
    //   .leftJoinAndSelect('product.specs', 'specs')
    // builder.andWhere(buildWhereQuery())
    // const paginator = buildPaginator({
    //   mode: PaginatorMode.Index,
    //   entity: Product,
    //   query: {
    //     order: order,
    //     skip: page.skip,
    //     limit: page.limit,
    //   },
    // })
    // return paginator.paginate(builder)
  }

  /**
   * 查询商品详情
   */
  public findOne(id: string) {
    // const builder = this.productRepository
    //   .createQueryBuilder('product')
    //   .leftJoinAndSelect('product.attrs', 'attrs')
    //   .leftJoinAndSelect('attrs.items', 'items')
    //   .leftJoinAndSelect('product.specs', 'specs')
    // builder.andWhere(`product.id = :id`, {
    //   id,
    // })
    // return builder.getOne()
  }

  /**
   * 创建商品
   * @returns
   */
  public async create(input: Partial<Product>, category: Category) {
    // 保存相关图片
    await this.saveProductImages(input)
    // 创建商品
    return this.productRepository.create({
      ...input,
      category,
      enable: false, // 创建商品不会自动上架
    })
  }

  /**
   * 更新商品
   * @returns
   */
  public async update(
    id: string,
    input: Partial<Product>,
    category?: Category,
  ) {
    if (category) {
      input.category = category
    }

    // 更新相关图片
    await this.saveProductImages(input)

    return this.productRepository.update(id, input)
  }

  /**
   * 商品上架操作
   * @returns
   */
  public async publish(id: string, versionId) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { versions: true },
    })

    // 待下架商品配置
    const unpublishVersion = product.versions.find(
      (x) => x.enable === true && x.id !== versionId,
    )

    // 待上架商品配置
    const publishVersion = product.versions.find((x) => x.id === versionId)

    if (!publishVersion) {
      throw new Error('无法找到相应配置版本')
    }

    await this.dataSource.manager.transaction(async (manager) => {
      // 上架商品
      if (!product.enable) {
        product.enable = true
        await manager.save(unpublishVersion)
      }

      if (unpublishVersion) {
        unpublishVersion.enable = false
        await manager.save(unpublishVersion)
      }

      if (publishVersion) {
        publishVersion.enable = true
        await manager.save(unpublishVersion)
      }
    })
  }

  /**
   * 商品下架操作
   * @returns
   */
  public unpublish(id: string) {
    return this.productRepository.update(id, { enable: false })
  }

  /**
   * 创建商品属性
   */
  public createProductAttr(attr: CreateProductAttrInput) {
    // const items = attr.items.map((item) =>
    //   this.productAttrItemRepository.create(item),
    // )
    // return this.productAttrRepository.create({
    //   name: attr.name,
    //   primary: attr.primary,
    //   items,
    // })
  }

  /**
   * 创建商品Spec
   */
  public createProductSpec(spac: createProductSpecInput) {
    // return this.productSpecRepository.create(spac)
  }

  /**
   * 保存产品图片
   * @param product
   */
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

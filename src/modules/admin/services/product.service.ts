import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
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
  ProductAttrInput,
  ProductAttrItemInput,
  ProductSpecInput,
  UpdateProductAttrInput,
  UpdateProductAttrItemInput,
  UpdateProductSpecInput,
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
    const builder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.versions', 'version')
      .leftJoinAndSelect('version.attrs', 'attr')
      .leftJoinAndSelect('version.specs', 'spec')
      .leftJoinAndSelect('attr.items', 'attr_item')
      .leftJoinAndSelect('spec.items', 'spec_item')
      .leftJoinAndSelect('product.category', 'category')

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
      .leftJoinAndSelect('product.versions', 'version')
      .leftJoinAndSelect('version.attrs', 'attr')
      .leftJoinAndSelect('version.specs', 'spec')
      .leftJoinAndSelect('attr.items', 'attr_item')
      .leftJoinAndSelect('spec.items', 'spec_item')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id = :id', { id })

    return builder.getOne()
  }

  /**
   * 获取所有商品版本
   */
  public findAllVersion(productId: string) {
    const builder = this.productVersionRepository
      .createQueryBuilder('version')
      .leftJoinAndSelect('version.attrs', 'attr')
      .leftJoinAndSelect('version.specs', 'spec')
      .leftJoinAndSelect('attr.items', 'attr_item')
      .leftJoinAndSelect('spec.items', 'spec_item')
      .where('version.product_id = :id', { id: productId })

    return builder.getMany()
  }

  /**
   * 获取指定商品版本
   */
  public findOneVersion(versionId: string) {
    const builder = this.productVersionRepository
      .createQueryBuilder('version')
      .leftJoinAndSelect('version.attrs', 'attr')
      .leftJoinAndSelect('version.specs', 'spec')
      .leftJoinAndSelect('attr.items', 'attr_item')
      .leftJoinAndSelect('spec.items', 'spec_item')
      .where('version.id = :id', { id: versionId })

    return builder.getOne()
  }

  /**
   * 创建商品
   * @returns
   */
  public async create(input: Partial<Product>, category: Category) {
    // 保存相关图片
    await this.saveProductImages(input)
    // 创建商品
    const product = this.productRepository.create({
      ...input,
      category,
      enable: false, // 创建商品不会自动上架
    })

    return product.save({ reload: true })
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
   * 创建商品版本
   * @param product
   * @returns
   */
  public async createProductVersion(productId: string) {
    const product = await this.productRepository.findOneBy({ id: productId })
    const version = this.productVersionRepository.create()

    // 设置关联商品
    version.product = product
    version.enable = false

    return version.save({ reload: true })
  }

  /**
   * 配置商品属性
   * @param versionId
   * @param attrsInput
   */
  public async setupProductAttrs(
    versionId: string,
    attrsInput: ProductAttrInput[],
  ) {
    const version = await this.productVersionRepository.findOneBy({
      id: versionId,
    })

    if (!version) {
      throw new Error('无法找对应商品版本')
    }

    // 生成商品属性实体
    const productAttrs = attrsInput.map((attr) => {
      const productAttr = this.productAttrRepository.create(attr)
      productAttr.version = version
      return productAttr
    })

    return this.productAttrRepository.save(productAttrs, { reload: true })
  }

  /**
   * 配置商品属性项
   * @param versionId
   * @param itemsInput
   * @returns
   */
  public async setupProductAttrItems(
    versionId: string,
    itemsInput: ProductAttrItemInput[],
  ) {
    const attrs = await this.productAttrRepository.find({
      where: { version: { id: versionId } },
    })

    if (!attrs || !attrs.length) {
      throw new Error('无法找对应商品版本的属性')
    }

    // 保存图片
    for (const item of itemsInput) {
      if (item.image) {
        await this.fileService.save(item.image)
      }
    }

    // 获取AttrItems
    const items = itemsInput.map((item) => {
      const attrItem = this.productAttrItemRepository.create({
        name: item.name,
        image: item.image,
      })

      attrItem.attr = attrs.find((attr) => attr.id === item.attrId)

      if (!attrItem.attr) {
        throw new Error('属性ID配置错误')
      }

      return attrItem
    })

    // 更新items
    await this.productAttrItemRepository.save(items, { reload: true })

    // 生成Specs
    const specs = await this.generateProductSpecs(versionId)

    return this.productSpecRepository.save(specs, { reload: true })
  }

  /**
   * 配置商品Specs
   * @param specsInput
   * @returns
   */
  public async setupProductSpecs(specsInput: ProductSpecInput[]) {
    return await this.dataSource.manager.transaction(async () => {
      return Promise.all(
        specsInput
          .filter((spec) => spec.price)
          .map((spec) =>
            this.productSpecRepository.update(spec.id, { price: spec.price }),
          ),
      )
    })
  }

  /**
   * 生成商品Spec
   * @param versionId
   * @returns
   */
  public async generateProductSpecs(versionId: string) {
    const version = await this.productVersionRepository.findOneBy({
      id: versionId,
    })

    const attrs = await this.productAttrRepository.find({
      where: { version: { id: versionId } },
      relations: { items: true },
    })

    const results: ProductAttrItem[][] = []

    const generate = (startIndex = 0, current: ProductAttrItem[]) => {
      if (startIndex === attrs.length) {
        results.push([...current])
        return
      }

      const items = attrs[startIndex].items

      for (let i = 0; i < items.length; i++) {
        current.push(items[i])
        generate(startIndex + 1, current)
        current.pop()
      }
    }

    // 遍历生成组合
    generate(0, [])

    return results.map((items) =>
      this.productSpecRepository.create({
        version,
        items,
      }),
    )
  }

  /**
   * 更新商品属性
   * @param id
   * @param input
   * @returns
   */
  public updateProductAttr(id: string, input: UpdateProductAttrInput) {
    return this.productAttrRepository.update(id, {
      name: input.name,
    })
  }

  /**
   * 更新商品属性项
   * @param id
   * @param input
   * @returns
   */
  public async updateProductAttrItem(
    id: string,
    input: UpdateProductAttrItemInput,
  ) {
    if (input.image) {
      await this.fileService.save(input.image)
    }

    return this.productAttrItemRepository.update(id, {
      ...input,
    })
  }

  /**
   * 更新商品Spec
   * @param id
   * @param input
   * @returns
   */
  public updateProductSpec(id: string, input: UpdateProductSpecInput) {
    return this.productSpecRepository.update(id, {
      price: input.price,
    })
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

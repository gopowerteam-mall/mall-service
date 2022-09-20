import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginatorMode } from 'src/config/enum.config'
import { MaterialGroup } from 'src/entities/material-group.entity'
import { Material } from 'src/entities/material.entity'
import { FileService } from 'src/modules/qiniu/services/file.service'
import { QueryInputParam } from 'src/shared/typeorm/interfaces'
import { buildPaginator } from 'src/shared/typeorm/query/paginator'
import { IsNull, Repository } from 'typeorm'

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(MaterialGroup)
    private readonly materialGroupRepository: Repository<MaterialGroup>,
    private fileService: FileService,
  ) {}

  /**
   * 创建素材
   * @param key
   * @param group
   */
  public create(keys: string[], group?: string) {
    return Promise.all(keys.map((key) => this.fileService.save(key, group)))
  }

  /**
   * 查询所有素材
   */
  public findAll({ buildWhereQuery, page, order }: QueryInputParam<Material>) {
    const builder = this.materialRepository.createQueryBuilder('material')
    builder.andWhere(buildWhereQuery())
    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: Material,
      query: {
        order: order,
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  /**
   * 删除素材
   * @param key
   * @returns
   */
  public deleteBatch(ids: string[]) {
    return this.materialRepository.softDelete(ids)
  }

  /**
   * 修改material所属分组
   * @param ids
   * @param group
   * @returns
   */
  public async changeGroupBatch(ids: string[], group?: string) {
    return this.materialRepository.update(ids, {
      group: group ? { id: group } : undefined,
    })
  }

  /**
   * 获取分组列表
   * @returns
   */
  public async findAllGroup() {
    const groups = await this.materialGroupRepository
      .createQueryBuilder('group')
      .leftJoin(Material, 'material', 'material.groupId = group.id')
      .select([
        'group.id as id',
        'group.name as name',
        'COUNT(material.id)::int as count',
      ])
      .groupBy('group.id')
      .getRawMany()

    const count = await this.materialRepository
      .createQueryBuilder('material')
      .where('material.groupId IS NULL')
      .getCount()

    return [
      ...groups,
      {
        id: '',
        name: '未分组',
        count,
      },
    ]
  }

  /**
   * 创建分组
   * @param name
   * @returns
   */
  public createGroup(name: string) {
    return this.materialGroupRepository.save({
      name,
    })
  }

  /**
   * 更新分组
   * @param id
   * @param name
   * @returns
   */
  public updateGroup(id: string, name: string) {
    return this.materialGroupRepository.update(id, {
      name,
    })
  }

  /**
   * 删除分组
   * @param id
   */
  public async deleteGroup(id: string, target?: string) {
    // 更新原分组数据
    await this.materialRepository.update(
      { group: { id } },
      { group: target ? { id: target } : undefined },
    )

    // 删除分组
    return this.materialGroupRepository.delete(id)
  }
}

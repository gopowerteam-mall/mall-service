/**
 * 分页类型
 */
export enum PaginatorMode {
  Cursor = 'CURSOR',
  Index = 'INDEX',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum WhereOperator {
  In = 'IN',
  Like = 'LIKE',
  Equal = 'EQUAL',
  Between = 'BETWEEN',
}

/**
 * 管理员角色
 */
export enum AdminRole {
  Normal = 'NORMAL_ADMIN',
  Super = 'SUPER_ADMIN',
}

/**
 * TOKEN来源
 */
export enum AppOrigin {
  Admin = 'admin',
  Weapp = 'weapp',
}

/**
 * Banner类型
 */
export enum BannerType {
  URL = 'URL',
  Page = 'PAGE',
  Project = 'PROJECT',
}

/**
 * 文件类型
 */
export enum FileType {
  Image = 'IMAGE',
  Video = 'VIDEO',
  Audio = 'AUDIO',
  Document = 'DOCUMENT',
  Other = 'OTHER',
}

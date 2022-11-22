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
  App = 'app',
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

/**
 * 商品订单状态
 */
export enum ProductOrderState {
  Pending = 'PENDING', // 待支付
  Processing = 'PROCESSING', // 进行中
  Finished = 'FINISHED', // 已完成
  Expired = 'EXPIRED', // 已过期
  Refunded = 'REFUNDED', // 已退款
  Closed = 'CLOSED', // 已关闭
}

/**
 * 支付订单状态
 */
export enum PaymentOrderState {
  Pending = 'PENDING', // 待支付
  Paid = 'PAID', // 已支付
  Expired = 'EXPIRED', // 已过期
  Refunded = 'REFUNDED', // 已退款
}

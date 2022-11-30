import { Module } from '@nestjs/common'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './controllers/app.controller'
import { User } from 'src/entities/user.entity'
import { AuthModule } from 'src/auth/auth.module'
import { BannerController } from './controllers/banner.controller'
import { BannerService } from './services/banner.service'
import { Banner } from 'src/entities/banner.entity'
import { QiniuModule } from '../qiniu/qiniu.module'
import { AdministratorController } from './controllers/administrator.controller'
import { AdministratorService } from './services/administrator.service'
import { Administrator } from 'src/entities/administrator.entity'
import { CategoryController } from './controllers/category.controller'
import { Category } from 'src/entities/category.entity'
import { CategoryService } from './services/category.service'
import { MaterialController } from './controllers/material.controller'
import { MaterialService } from './services/material.service'
import { Material } from 'src/entities/material.entity'
import { MaterialGroup } from 'src/entities/material-group.entity'
import { Product } from 'src/entities/product.entity'
import { ProductAttr } from 'src/entities/product-attr.entity'
import { ProductAttrItem } from 'src/entities/product-attr-item.entity'
import { ProductSpec } from 'src/entities/product-spec.entity'
import { ProductController } from './controllers/product.controller'
import { ProductService } from './services/product.service'
import { OrderController } from './controllers/order.controller'
import { OrderService } from './services/order.service'
import { ProductOrder } from 'src/entities/product-order.entity'
import { ProductOrderItem } from 'src/entities/product-order-item.entity'
import { PaymentOrder } from 'src/entities/payment-order.entity'

@Module({
  imports: [
    AuthModule,
    QiniuModule,
    TypeOrmModule.forFeature([
      Administrator,
      User,
      Banner,
      Category,
      Material,
      MaterialGroup,
      Product,
      ProductAttr,
      ProductAttrItem,
      ProductSpec,
      ProductOrder,
      ProductOrderItem,
      PaymentOrder,
    ]),
  ],
  providers: [
    UserService,
    BannerService,
    AdministratorService,
    CategoryService,
    MaterialService,
    ProductService,
    OrderService,
  ],
  controllers: [
    AdministratorController,
    UserController,
    AppController,
    BannerController,
    CategoryController,
    MaterialController,
    ProductController,
    OrderController,
  ],
})
export class AdminModule {}

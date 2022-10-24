import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'
import { BannerService } from './services/banner.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Banner } from 'src/entities/banner.entity'
import { HomeController } from './controllers/home.controller'
import { CategoryService } from './services/category.service'
import { ProductService } from './services/product.service'
import { Category } from 'src/entities/category.entity'
import { Product } from 'src/entities/product.entity'
import { ProductAttr } from 'src/entities/product-attr.entity'
import { ProductAttrItem } from 'src/entities/product-attr-item.entity'
import { ProductSpec } from 'src/entities/product-spec.entity'

@Module({
  imports: [
    HttpModule,
    AuthModule,
    TypeOrmModule.forFeature([
      Banner,
      Category,
      Product,
      ProductAttr,
      ProductAttrItem,
      ProductSpec,
    ]),
  ],
  controllers: [AppController, HomeController],
  providers: [AppService, BannerService, CategoryService, ProductService],
})
export class ClientModule {}

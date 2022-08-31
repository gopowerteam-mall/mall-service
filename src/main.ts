import { RequestMethod, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AdminModule } from './modules/admin/admin.module'
import { WeappModule } from './modules/weapp/weapp.module'
import { join } from 'path'
import { QiniuModule } from './modules/qiniu/qiniu.module'
/**
 * 配置Swagger
 * @param app
 */
function setupSwagger(app: NestFastifyApplication) {
  const adapter = app.getHttpAdapter()

  /**
   * 配置管理端Swagger接口
   */
  function setupAdminDocument() {
    const adminDocumentConfig = new DocumentBuilder()
      .setTitle('Admin接口文档')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('app', '系统')
      .addTag('administrator', '管理员')
      .addTag('user', '用户')
      .addTag('banner', 'Banner')
      .addTag('qiniu', '七牛')

      .build()

    const adminDocument = SwaggerModule.createDocument(
      app,
      adminDocumentConfig,
      {
        include: [AdminModule, QiniuModule],
      },
    )

    SwaggerModule.setup('admin/docs', app, adminDocument, {
      customCssUrl: '/swagger-ui.css',
    })

    // 设置OPENAPI接口地址
    adapter.get('/admin/api-docs', function (req, res) {
      res.send(JSON.stringify(adminDocument))
    })
  }

  /**
   * 配置小程序Swagger接口
   */
  function setupWeappDocument() {
    const weappDocumentConfig = new DocumentBuilder()
      .setTitle('Weapp接口文档')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('app', '系统')
      .addTag('user', '用户')
      .addTag('category', '商品分类')

      .addTag('qiniu', '七牛')
      .build()

    const weappDocument = SwaggerModule.createDocument(
      app,
      weappDocumentConfig,
      {
        include: [WeappModule, QiniuModule],
      },
    )

    SwaggerModule.setup('weapp/docs', app, weappDocument, {
      customCssUrl: '/swagger-ui.css',
    })

    // 设置OPENAPI接口地址
    adapter.get('/weapp/api-docs', function (req, res) {
      res.send(JSON.stringify(weappDocument))
    })
  }

  setupAdminDocument()
  setupWeappDocument()
}

/**
 * 初始化应用
 * @returns
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
    },
  )

  // 安装全局前缀
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.ALL,
      },
    ],
  })

  // 安装验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
  })

  // 安装Swagger
  setupSwagger(app)

  return app
}

/**
 * 启动应用
 * @param app
 */
async function launch(app: NestFastifyApplication) {
  const config = app.get(ConfigService)

  const port = await config.get('app.port')

  await app.listen(port)
}

// 初始化并启动应用
bootstrap().then(launch)

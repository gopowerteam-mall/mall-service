import { Module } from '@nestjs/common'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from 'src/entities/admin.entity'
import { AdminService } from './services/admin.service'
import { AdminController } from './controllers/admin.controller'
import { AppController } from './controllers/app.controller'
import { User } from 'src/entities/user.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Admin, User])],
  providers: [UserService, AdminService],
  controllers: [UserController, AdminController, AppController],
})
export class AdminModule {}

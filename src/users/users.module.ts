import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersRepository } from '../db/repo/users.repository'
import { DbModule } from '../db/db.module'

@Module({
  imports: [DbModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService], // Експортуємо сервіс для AuthModule
})
export class UsersModule {}

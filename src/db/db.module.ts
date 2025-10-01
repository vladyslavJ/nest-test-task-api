import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createDbConnection, getDatabaseConfig } from './index'
import { UsersRepository, NotesRepository } from './repo'
import configuration from '../common/configuration'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          url:
            configService.get<string>('DATABASE_URL') ||
            'postgresql://postgres:postgres@localhost:5432/nest_test_task',
        }
        return createDbConnection(dbConfig)
      },
    },
    {
      provide: UsersRepository,
      inject: ['DATABASE_CONNECTION'],
      useFactory: db => new UsersRepository(db),
    },
    {
      provide: NotesRepository,
      inject: ['DATABASE_CONNECTION'],
      useFactory: db => new NotesRepository(db),
    },
  ],
  exports: [UsersRepository, NotesRepository],
})
export class DbModule {}

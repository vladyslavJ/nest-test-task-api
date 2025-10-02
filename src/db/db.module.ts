import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createDbConnection } from './index'
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
      provide: 'DATABASE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          url: configService.get<string>('postgres.url'),
        }
        return createDbConnection(dbConfig)
      },
    },
    {
      provide: UsersRepository,
      inject: ['DATABASE'],
      useFactory: db => new UsersRepository(db),
    },
    {
      provide: NotesRepository,
      inject: ['DATABASE'],
      useFactory: db => new NotesRepository(db),
    },
  ],
  exports: [UsersRepository, NotesRepository, 'DATABASE'],
})
export class DbModule {}

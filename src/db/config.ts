import { z } from 'zod'
import { ConfigService } from '@nestjs/config'

export const databaseConfigSchema = z.object({
  url: z.string().url('Database URL must be a valid URL'),
})

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>

export const getDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => {
  const config = {
    url: configService.get<string>('postgres.url'),
  }

  return databaseConfigSchema.parse(config)
}

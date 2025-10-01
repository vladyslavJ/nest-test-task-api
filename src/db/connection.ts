import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { DatabaseConfig } from './config'
import * as schema from './schemas'

export const createDbConnection = (config: DatabaseConfig) => {
  const connectionString = config.url
  const client = postgres(connectionString)

  return drizzle(client, { schema })
}

export type Database = ReturnType<typeof createDbConnection>

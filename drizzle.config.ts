import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import type { Config } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
    prefix: 'timestamp',
  },
}) satisfies Config

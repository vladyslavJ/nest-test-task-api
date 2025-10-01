export default () => ({
  postgres: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'notion',
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@postgres:5432/notion?schema=public',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: '60m',
  },
})

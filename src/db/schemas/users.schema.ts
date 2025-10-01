import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const userRoles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof userRoles)[keyof typeof userRoles]

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 })
    .$type<UserRole>()
    .notNull()
    .default(userRoles.USER),
  isBlocked: boolean('is_blocked').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

import { Inject } from '@nestjs/common'
import { eq, ilike, and, SQL } from 'drizzle-orm'
import { BaseRepository } from './base.repository'
import { users, User, NewUser } from '../schemas'
import { Database } from '../connection'

export interface FindUsersOptions {
  name?: string
  isBlocked?: boolean
}

export class UsersRepository extends BaseRepository<User, NewUser> {
  constructor(@Inject('DATABASE') db: Database) {
    super(db)
  }

  getTable() {
    return users
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne(eq(users.email, email) as SQL<boolean>)
  }

  async findById(id: number): Promise<User | undefined> {
    return this.findOne(eq(users.id, id) as SQL<boolean>)
  }

  async findWithFilters(options: FindUsersOptions = {}): Promise<User[]> {
    const conditions: SQL<boolean>[] = []

    if (options.name !== undefined) {
      conditions.push(ilike(users.name, `%${options.name}%`) as SQL<boolean>)
    }

    if (options.isBlocked !== undefined) {
      conditions.push(eq(users.isBlocked, options.isBlocked) as SQL<boolean>)
    }

    if (conditions.length === 0) {
      return this.findAll()
    }

    return this.findAll(and(...conditions) as SQL<boolean>)
  }

  async blockUser(id: number, isBlocked: boolean): Promise<User | undefined> {
    return this.update(eq(users.id, id) as SQL<boolean>, { isBlocked })
  }
}

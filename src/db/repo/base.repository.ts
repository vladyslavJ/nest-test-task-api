import { SQL, sql } from 'drizzle-orm'
import { Database } from '../connection'

// Абстрактний базовий клас для репозиторіїв (слідуючи принципу DIP)
export abstract class BaseRepository<T, U> {
  constructor(protected readonly db: Database) {}

  // Абстрактний метод, який повинен бути реалізований в похідних класах
  abstract getTable(): any

  // Основні CRUD операції
  async findAll(where?: SQL<boolean>): Promise<T[]> {
    const table = this.getTable()

    if (where) {
      return this.db.select().from(table).where(where)
    }

    return this.db.select().from(table)
  }

  async findOne(where: SQL<boolean>): Promise<T | undefined> {
    const table = this.getTable()
    const results = await this.db.select().from(table).where(where).limit(1)

    return results[0]
  }

  async create(data: U): Promise<T> {
    const table = this.getTable()
    const result = await this.db.insert(table).values(data).returning()

    return result[0]
  }

  async update(where: SQL<boolean>, data: Partial<U>): Promise<T | undefined> {
    const table = this.getTable()
    const result = await this.db
      .update(table)
      .set(data)
      .where(where)
      .returning()

    return result[0]
  }

  async delete(where: SQL<boolean>): Promise<T | undefined> {
    const table = this.getTable()
    const result = await this.db.delete(table).where(where).returning()

    return result[0]
  }
}

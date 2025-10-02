import { Inject } from '@nestjs/common'
import { eq, SQL, sql } from 'drizzle-orm'
import { BaseRepository } from './base.repository'
import { notes, Note, NewNote } from '../schemas'
import { Database } from '../connection'

// Інтерфейс для опцій пагінації
export interface PaginationOptions {
  page?: number
  limit?: number
}

// Інтерфейс для результату з пагінацією
export interface FindNotesResult {
  items: Note[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Конкретна реалізація репозиторію для нотаток
export class NotesRepository extends BaseRepository<Note, NewNote> {
  constructor(@Inject('DATABASE') db: Database) {
    super(db)
  }

  getTable() {
    return notes
  }

  // Спеціалізовані методи для роботи з нотатками
  async findById(id: number): Promise<Note | undefined> {
    return this.findOne(eq(notes.id, id) as SQL<boolean>)
  }

  // Метод для пошуку нотаток користувача з пагінацією
  async findByUserId(
    userId: number,
    options: PaginationOptions = {},
  ): Promise<FindNotesResult> {
    const page = options.page || 1
    const limit = options.limit || 10
    const offset = (page - 1) * limit

    const items = await this.db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .limit(limit)
      .offset(offset)

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(eq(notes.userId, userId))

    const total = Number(count)
    const totalPages = Math.ceil(total / limit)

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    }
  }

  // Метод для отримання всіх нотаток з пагінацією (для адміна)
  async findWithPagination(
    options: PaginationOptions = {},
  ): Promise<FindNotesResult> {
    const page = options.page || 1
    const limit = options.limit || 10
    const offset = (page - 1) * limit

    const items = await this.db.select().from(notes).limit(limit).offset(offset)

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(notes)

    const total = Number(count)
    const totalPages = Math.ceil(total / limit)

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    }
  }
}

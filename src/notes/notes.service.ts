import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { NotesRepository, FindNotesResult } from '../db/repo/notes.repository'
import { Note, NewNote, userRoles } from '../db/schemas'
import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'
import { PaginationDto } from './dto/pagination.dto'
import { eq, SQL } from 'drizzle-orm'
import { notes } from '../db/schemas/notes.schema'

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const newNote: NewNote = {
      ...createNoteDto,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return this.notesRepository.create(newNote)
  }

  async findAll(
    paginationDto: PaginationDto,
    userId: number,
    userRole: string,
  ): Promise<FindNotesResult> {
    if (userRole === userRoles.ADMIN) {
      return this.notesRepository.findWithPagination(paginationDto)
    }

    return this.notesRepository.findByUserId(userId, paginationDto)
  }

  async findOne(id: number, userId: number, userRole: string): Promise<Note> {
    const note = await this.notesRepository.findById(id)

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`)
    }

    if (userRole !== userRoles.ADMIN && note.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this note',
      )
    }

    return note
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    userId: number,
    userRole: string,
  ): Promise<Note> {
    const existingNote = await this.findOne(id, userId, userRole)

    if (userRole !== userRoles.ADMIN && existingNote.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this note',
      )
    }

    const updateData: Partial<NewNote> = {
      ...updateNoteDto,
      updatedAt: new Date(),
    }

    const updatedNote = await this.notesRepository.update(
      eq(notes.id, id) as SQL<boolean>,
      updateData,
    )

    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`)
    }

    return updatedNote
  }

  async remove(id: number, userId: number, userRole: string): Promise<Note> {
    const existingNote = await this.findOne(id, userId, userRole)

    if (userRole !== userRoles.ADMIN && existingNote.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this note',
      )
    }

    const deletedNote = await this.notesRepository.delete(
      eq(notes.id, id) as SQL<boolean>,
    )

    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`)
    }

    return deletedNote
  }
}

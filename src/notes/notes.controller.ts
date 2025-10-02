import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { NotesService } from './notes.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { CreateNoteDto, createNoteSchema } from './dto/create-note.dto'
import { UpdateNoteDto, updateNoteSchema } from './dto/update-note.dto'
import { PaginationDto, paginationSchema } from './dto/pagination.dto'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger'
import { User, Note } from '../db/schemas'

@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  // @UsePipes(new ZodValidationPipe(createNoteSchema))
  async create(
    @Body(new ZodValidationPipe(createNoteSchema)) createNoteDto: CreateNoteDto,
    @CurrentUser() user: Partial<User>,
  ): Promise<Note> {
    return this.notesService.create(createNoteDto, user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes with pagination' })
  @ApiResponse({ status: 200, description: 'Returns notes with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  // @UsePipes(new ZodValidationPipe(paginationSchema))
  async findAll(
    @Query(new ZodValidationPipe(paginationSchema))
    paginationDto: PaginationDto,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.notesService.findAll(paginationDto, user.id, user.role)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note by ID' })
  @ApiResponse({ status: 200, description: 'Returns the note' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<User>,
  ): Promise<Note> {
    return this.notesService.findOne(id, user.id, user.role)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update note' })
  @ApiResponse({ status: 200, description: 'Returns updated note' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  // @UsePipes(new ZodValidationPipe(updateNoteSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateNoteSchema)) updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: Partial<User>,
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto, user.id, user.role)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete note' })
  @ApiResponse({ status: 200, description: 'Returns deleted note' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Partial<User>,
  ): Promise<Note> {
    return this.notesService.remove(id, user.id, user.role)
  }
}

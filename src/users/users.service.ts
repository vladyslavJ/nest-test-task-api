import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { UsersRepository } from '../db/repo/users.repository'
import { User, NewUser, userRoles, users } from '../db/schemas'
import * as bcrypt from 'bcryptjs'
import { FilterUsersDto } from './dto/filter-users.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { eq, SQL } from 'drizzle-orm'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(
    userData: Omit<NewUser, 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return this.usersRepository.create(userData)
  }

  async findAll(filters: FilterUsersDto = {}): Promise<User[]> {
    return this.usersRepository.findWithFilters(filters)
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email)
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number,
    currentUserRole: string,
  ): Promise<User> {
    if (currentUserRole !== userRoles.ADMIN && currentUserId !== id) {
      throw new ForbiddenException('You are not authorized to update this user')
    }

    const user = await this.findById(id)

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email)
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists')
      }
    }

    const updateData: Partial<NewUser> = { ...updateUserDto }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    updateData.updatedAt = new Date()

    if (currentUserRole !== userRoles.ADMIN) {
      delete updateData.role
      delete updateData.isBlocked
    }

    const updatedUser = await this.usersRepository.update(
      eq(users.id, id) as SQL<boolean>,
      updateData,
    )

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return updatedUser
  }

  async remove(id: number, currentUserId: number): Promise<User> {
    if (id === currentUserId) {
      throw new ForbiddenException('You cannot delete your own account.')
    }
    const deletedUser = await this.usersRepository.delete(
      eq(users.id, id) as SQL<boolean>,
    )
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return deletedUser
  }

  async blockUser(id: number, isBlocked: boolean): Promise<User> {
    const updatedUser = await this.usersRepository.blockUser(id, isBlocked)

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return updatedUser
  }
}

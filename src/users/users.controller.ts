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
  ForbiddenException,
  UsePipes,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, userRoles } from '../db/schemas'
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto'
import { FilterUsersDto } from './dto/filter-users.dto'
import { BlockUserDto, blockUserSchema } from './dto/block-user.dto'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with optional filtering' })
  @ApiResponse({ status: 200, description: 'Returns array of users' })
  async findAll(@Query() filters: FilterUsersDto): Promise<User[]> {
    return this.usersService.findAll(filters)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: Partial<User>,
  ): Promise<User> {
    // Звичайні користувачі можуть отримувати лише свій профіль
    if (currentUser.role !== userRoles.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException(
        'You are not authorized to access this user data',
      )
    }
    return this.usersService.findById(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'Returns updated user' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'User not found' })
  //@UsePipes(new ZodValidationPipe(updateUserSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(
      id,
      updateUserDto,
      currentUser.id,
      currentUser.role,
    )
  }

  @Delete(':id')
  @Roles(userRoles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns deleted user' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(id)
  }

  @Patch(':id/block')
  @Roles(userRoles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Block/unblock user (admin only)' })
  @ApiResponse({ status: 200, description: 'Returns updated user' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'User not found' })
  //@UsePipes(new ZodValidationPipe(blockUserSchema))
  async blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(blockUserSchema)) blockUserDto: BlockUserDto,
  ): Promise<User> {
    return this.usersService.blockUser(id, blockUserDto.isBlocked)
  }
}

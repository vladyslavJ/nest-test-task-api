import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto, registerUserSchema } from './dto/register-user.dto'
import { LoginUserDto, loginUserSchema } from './dto/login-user.dto'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import {
  AUTH_CONTROLLER_ROUTE,
  AUTH_ROUTES,
} from 'src/common/utils/constants/auth.const'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('auth')
@Controller(AUTH_CONTROLLER_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.REGISTER)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. User with this email already exists.',
  })
  async register(
    @Body()
    registerUserDto: RegisterUserDto,
  ) {
    return this.authService.register(registerUserDto)
  }

  @Post(AUTH_ROUTES.LOGIN)
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: { example: { accessToken: 'string' } },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }
}

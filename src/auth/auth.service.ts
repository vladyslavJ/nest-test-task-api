import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcryptjs'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { userRoles } from '../db/schemas/users.schema'
import { AuthServiceInterface } from './interfaces/auth-service.interface'
import { AUTH_EXCEPTION_COMMENTS } from '../common/utils/constants/auth.const'

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.usersService.findByEmail(
      registerUserDto.email,
    )
    if (existingUser) {
      throw new ConflictException(AUTH_EXCEPTION_COMMENTS.EMAIL_CONFLICT)
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10)

    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
      role: userRoles.USER,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user
    return result
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email)
    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        AUTH_EXCEPTION_COMMENTS.INVALID_CREDENTIALS,
      )
    }
    if (user.isBlocked) {
      throw new UnauthorizedException(AUTH_EXCEPTION_COMMENTS.USER_BLOCKED)
    }

    const payload = { email: user.email, sub: user.id, role: user.role }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}

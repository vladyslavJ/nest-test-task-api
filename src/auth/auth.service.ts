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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.usersService.findByEmail(
      registerUserDto.email,
    )
    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10)

    const newUser = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
      role: userRoles.USER, // За замовчуванням роль USER
    })

    // Не повертаємо пароль
    const { ...result } = newUser
    return result
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email)

    if (
      !user ||
      !(await bcrypt.compare(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked')
    }

    const payload = { email: user.email, sub: user.id, role: user.role }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}

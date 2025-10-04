import { User } from 'src/db/schemas'
import { LoginUserDto } from '../dto/login-user.dto'
import { RegisterUserDto } from '../dto/register-user.dto'

export interface AuthServiceInterface {
  register(registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>>
  login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }>
}

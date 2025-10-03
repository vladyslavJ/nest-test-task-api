import { Request } from 'express'
import { User } from 'src/db/schemas'

export interface RequestWithUser extends Request {
  user: User
}

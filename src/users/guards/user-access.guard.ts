import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { userRoles } from '../../db/schemas'
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface'

@Injectable()
export class UserAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user
    const paramsId = Number.parseInt(request.params.id, 10)

    if (!user) {
      return false
    }
    if (user.role === userRoles.ADMIN) {
      return true
    }
    if (user.id === paramsId) {
      return true
    }

    throw new ForbiddenException(
      'You are not authorized to access this resource',
    )
  }
}

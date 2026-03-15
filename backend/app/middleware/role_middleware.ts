import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

import UnauthorizedException from '#exceptions/unauthorized_exception'
import ForbiddenException from '#exceptions/forbidden_exception'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    roles: string[]
  ) {
    const user = ctx.auth.user

    if (!user) {
      throw new UnauthorizedException()
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException()
    }

    return next()
  }
}
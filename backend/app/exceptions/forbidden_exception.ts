import { Exception } from '@adonisjs/core/exceptions'

export default class ForbiddenException extends Exception {
  static status = 403
  static code = 'E_FORBIDDEN'

  constructor(message = 'You do not have permission to access this resource') {
    super(message)
  }
}
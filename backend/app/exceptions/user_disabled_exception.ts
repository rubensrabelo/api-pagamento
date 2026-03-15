import { Exception } from '@adonisjs/core/exceptions'

export default class UserDisabledException extends Exception {
  static status = 403
  static message = 'User account is disabled'
}
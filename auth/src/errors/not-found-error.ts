import { CustomError } from './custom-error'

export class NotFoundError extends CustomError {
  statusCode = 404
  reason = "error connecting to database"

  constructor() {
    super('route not found - for logs')

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [
      { message: 'not found' }
    ]
  }
}

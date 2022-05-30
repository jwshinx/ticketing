export class DatabaseConnectionError extends Error {
  statusCode = 500
  reason = "error connecting to database"

  constructor() {
    super()

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}

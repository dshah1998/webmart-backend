/**
 * Title: Parent class of all the Errors;
 * Created By: Sarang Patel;
 */
export class AppError extends Error {
  constructor(
    public readonly message = "Internal server error",
    public readonly statusCode = 500,
    public readonly code = "INTERNAL_SERVER_ERROR"
  ) {
    super();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Title: Bad Request Error Class (status code = 400);
 * Created By: Sarang Patel;
 */
export class BadRequestError extends AppError {
  public readonly statusCode = 400;

  constructor(
    public readonly message = "Bad Request",
    public readonly code = "BAD_REQUEST"
  ) {
    super();
  }
}

/**
 * Title: Un authorize Error Class (status code = 401);
 * Created By: Sarang Patel;
 */
export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;

  constructor(
    public readonly message = "Unauthorized",
    public readonly code = "UNAUTHORIZED"
  ) {
    super();
  }
}

/**
 * Title: Entity not found Error Class (status code = 404);
 * Created By: Sarang Patel;
 */
export class NotFoundError extends AppError {
  public readonly statusCode = 404;

  constructor(
    public readonly message = "Not found",
    public readonly code = "NOT_FOUND"
  ) {
    super();
  }
}

/**
 * Title: Child of Entity not found Error Class (status code = 404);
 * Created By: Sarang Patel;
 * Description: This will add the error message when it calls the NotFoundError class.
 */
export class EntityNotFoundError<
  T extends { toString(): string }
> extends NotFoundError {
  constructor(public readonly id: T, public readonly entity: string) {
    super(
      `Could not find any matching record: ${id.toString()} for entity of type ${entity}`,
      `${entity.toUpperCase()}_NOT_FOUND`
    );
  }
}

/**
 * Title: Forbidden Error Class (status code = 403);
 * Created By: Sarang Patel;
 */
export class ForbiddenError extends AppError {
  public readonly statusCode = 403;

  constructor(
    public readonly message = "Forbidden",
    public readonly code = "FORBIDDEN"
  ) {
    super();
  }
}

/**
 * Title: Internal Server Error Class (status code = 403);
 * Created By: Sarang Patel;
 */
export class InternalServerError extends AppError {
  public readonly statusCode = 500;
}

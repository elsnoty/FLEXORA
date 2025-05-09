export class AppError extends Error {
    public readonly isOperational: boolean;

constructor(message: string) {
    super(message);
    this.name = "AppError";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
}
}

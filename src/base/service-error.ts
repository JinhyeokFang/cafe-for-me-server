export default class ServiceError extends Error {
  public readonly message: string;
  public readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

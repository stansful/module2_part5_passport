export class Exception<Type> extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly data?: Type;

  constructor(status: number, message: string, data?: Type) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

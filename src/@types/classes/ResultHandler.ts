export interface IResultHandler<T> {
  data: T;
  status: boolean;
  message: string;
}

export class ResultHandler<T> implements Partial<IResultHandler<T>> {
  data?: T;
  status?: boolean;
  message?: string;
  constructor({ data, message, status }: Partial<IResultHandler<T>> = {}) {
    this.data = data;
    this.status = status;
    this.message = message;
  }
}

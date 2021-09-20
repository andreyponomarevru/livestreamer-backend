import { errorCodes } from "./error-codes";

export class HttpError {
  statusCode: number;
  message?: string;
  more_info?: string;

  constructor(
    errorCode: number,
    message?: string,
    more_info = "https://github.com/ponomarevandrey/",
  ) {
    this.statusCode = errorCode;
    this.message = message;
    this.more_info = more_info;

    if (this.message === undefined) this.message = errorCodes[errorCode];
  }
}

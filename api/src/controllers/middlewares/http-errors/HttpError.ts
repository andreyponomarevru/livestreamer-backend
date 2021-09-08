import { errorCodes } from "./errorCodes";

export class HttpError {
  errorCode: number;
  message?: string;
  more_info?: string;

  constructor(
    errorCode: number,
    message?: string,
    more_info = "https://github.com/ponomarevandrey/musicbox",
  ) {
    this.errorCode = errorCode;
    this.message = message;
    this.more_info = more_info;

    if (this.message === undefined) this.message = errorCodes[errorCode];
  }
}

import { errorCodes } from "./http-error-codes";

export class HttpError {
  statusCode: number;
  message?: string;
  moreInfo?: string;

  constructor(
    errorCode: number,
    message?: string,
    more_info = "https://github.com/ponomarevandrey/",
  ) {
    this.statusCode = errorCode;
    this.message = message;
    this.moreInfo = more_info;

    if (this.message === undefined) this.message = errorCodes[errorCode];
  }
}

import {
  HttpErrorCodes,
  HttpErrorNames,
  HttpErrorMessages,
  HTTP_ERRORS,
} from "./../config/constants";

export class HttpError {
  status: HttpErrorCodes;
  statusText: HttpErrorNames;
  message?: string;
  moreInfo?: string;

  constructor({
    code,
    message,
    moreInfo = "https://github.com/ponomarevandrey/",
  }: {
    code: HttpErrorCodes;
    message?: string;
    moreInfo?: string;
  }) {
    this.status = code;
    this.statusText = HTTP_ERRORS[code];
    this.moreInfo = moreInfo;

    if (message) this.message = message;
  }
}

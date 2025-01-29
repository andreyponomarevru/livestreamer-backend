/* eslint-disable no-unused-vars */
// 'as const' allows us to use this array as type
export const RESOURCES = [
  "user_own_account",
  "all_user_accounts",
  "user_own_settings",
  "user_own_bookmarks",
  "broadcast",
  "all_broadcasts",
  "broadcast_draft",
  "all_broadcast_drafts",
  "scheduled_broadcast",
  "stream_like",
  "audio_stream",
  "user_own_chat_message",
  "any_chat_message",
] as const;

export const PERMISSIONS = [
  "create",
  "read",
  "update",
  "delete",
  "update_partially",
] as const;

export const HTTP_ERROR_MESSAGES = [
  "Specify either email OR username",
  "Invalid email, username or password",
  "Pending Account. Look for the verification email in your inbox and click the link in that email",
  "The requested page does not exist",
  "You must authenticate to access this resource",
  "You don't have permission to access this resource",
  "Username or email already exists",
  "Confirmation token is invalid",
  "Sorry, this username is already taken",
] as const;

export const HTTP_ERRORS = {
  400: "BadRequest",
  401: "Unauthorized",
  402: "PaymentRequired",
  403: "Forbidden",
  404: "NotFound",
  405: "MethodNotAllowed",
  406: "NotAcceptable",
  407: "ProxyAuthenticationRequired",
  408: "RequestTimeout",
  409: "Conflict",
  410: "Gone",
  411: "LengthRequired",
  412: "PreconditionFailed",
  413: "PayloadTooLarge",
  414: "URITooLong",
  415: "UnsupportedMediaType",
  416: "RangeNotSatisfiable",
  417: "ExpectationFailed",
  418: "ImATeapot",
  421: "MisdirectedRequest",
  422: "UnprocessableEntity",
  423: "Locked",
  424: "FailedDependency",
  425: "UnorderedCollection",
  426: "UpgradeRequired",
  428: "PreconditionRequired",
  429: "TooManyRequests",
  431: "RequestHeaderFieldsTooLarge",
  451: "UnavailableForLegalReasons",
  500: "InternalServerError",
  501: "NotImplemented",
  502: "BadGateway",
  503: "ServiceUnavailable",
  504: "GatewayTimeout",
  505: "HTTPVersionNotSupported",
  506: "VariantAlsoNegotiates",
  507: "InsufficientStorage",
  508: "LoopDetected",
  509: "BandwidthLimitExceeded",
  510: "NotExtended",
  511: "NetworkAuthenticationRequired",
} as const;

export type HttpErrorCodes = keyof typeof HTTP_ERRORS;
export type HttpErrorNames = (typeof HTTP_ERRORS)[HttpErrorCodes];
export type HttpErrorMessages = (typeof HTTP_ERROR_MESSAGES)[number];

export type Permissions = {
  [key in (typeof RESOURCES)[number]]?: (typeof PERMISSIONS)[number][];
};

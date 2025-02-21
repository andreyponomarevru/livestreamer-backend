export const moreInfo = { moreInfo: "https://github.com/ponomarevandrey/" };
export const response403 = {
  status: 403,
  statusText: "Forbidden",
  message: "You don't have permission to access this resource",
  ...moreInfo,
};
export const response401 = {
  status: 401,
  statusText: "Unauthorized",
  moreInfo: "https://github.com/ponomarevandrey/",
  message: "You must authenticate to access this resource",
};

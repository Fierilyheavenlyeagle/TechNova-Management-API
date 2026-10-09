import httpStatusCodes from "./httpStatusCodes.js";

import BaseError from "./baseError.js";

// Custom API Error Classes
class Api404Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Not found.",
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}
// Custom API Error Classes
class Api500Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.INTERNAL_SERVER,
    description = "Internal server error.",
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}
// Custom API Error Classes
class Api400Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = "Bad request.",
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}

export { Api404Error, Api500Error, Api400Error };

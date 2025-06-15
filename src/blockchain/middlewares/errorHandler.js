import { logError } from "../services/logger.js";

export default function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  logError(err);

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
    },
  });
}

// Application-level error with an HTTP status code. Throw this from controllers
// to return a specific status; anything else becomes a generic 500.
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// 404 handler for unmatched routes.
export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Central error handler. Keeps internal details (SQL errors, stack traces) out
// of the client response while still logging them server-side.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;

  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const message =
    status >= 500 ? "Something went wrong. Please try again later." : err.message;

  res.status(status).json({ message });
};

import { ApiError } from "./errorHandler.js";

// Validates req[source] against a Zod schema. On success, replaces the raw
// input with the parsed (and coerced) value. On failure, returns a 400 with a
// readable message.
export const validate = (schema, source = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".") || source}: ${issue.message}`)
      .join(", ");
    return next(new ApiError(400, message));
  }
  req[source] = result.data;
  next();
};

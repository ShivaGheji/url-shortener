import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
  try {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";
    let errors = [];

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      statusCode = 400;
      message = "Validation failed";
      errors = err.issues.map((e) => ({
        field: e.path.join(".") || null,
        message: e.message,
      }));
    }

    // Handle Mongoose CastError (invalid ObjectId)
    else if (err.name === "CastError") {
      statusCode = 404;
      message = "Resource not found";
    }

    // Handle Mongoose duplicate key
    else if (err.code === 11000) {
      statusCode = 400;
      message = "Duplicate field value entered";
      errors = Object.keys(err.keyValue || {}).map((field) => ({
        field,
        message: `Duplicate value for ${field}`,
      }));
    }

    // Handle Mongoose ValidationError
    else if (err.name === "ValidationError") {
      statusCode = 422;
      message = "Validation failed";
      errors = Object.values(err.errors).map((val) => ({
        field: val.path,
        message: val.message,
      }));
    }

    res.status(statusCode).json({
      success: false,
      message,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;

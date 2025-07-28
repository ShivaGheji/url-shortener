export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, (AbortSignal = false));

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ status: "fail", errors: messages });
    }

    next();
  };
};

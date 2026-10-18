import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

interface ValidationSchema {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

function formatZodError(err: ZodError) {
  return err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

export const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("Inside request validation");
    try {
      if (schema.body) {
        const parsedReqBody = await schema.body.parseAsync(req.body);
        req.body = parsedReqBody;
      }

      if (schema.query) {
        const parsedReqQuery = await schema.query.parseAsync(req.query);
        Object.defineProperty(req, "query", {
          value: parsedReqQuery,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }

      if (schema.params) {
        const parsedReqParams = await schema.params.parseAsync(req.params);
        req.params = parsedReqParams as typeof req.params;
      }

      console.log("Request Validation is success");

      next();
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        console.log(formatZodError(err));

        return res
          .status(400)
          .json({ success: false, data: null, error: "INVALID_REQUEST" });
      }

      return res
        .status(500)
        .json({ success: false, data: null, error: "SERVER_ERROR" });
    }
  };
};

import { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHandler<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) => Promise<any>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return async function (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, data: null, error: "Server Error" });
    }
  };
}

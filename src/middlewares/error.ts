import { Request,Response,NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  errors?: any; 
}

export function notFound(req:Request, res:Response, next:NextFunction) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function error(err:CustomError, req:Request, res:Response, next:NextFunction) {
  const statusCode = err.statusCode || 500;
  // console.log(err)
  res.status(statusCode).json({
    status: "error",
    message: err.message,
    error_code: statusCode,
    details: err.errors || null,
  });
}

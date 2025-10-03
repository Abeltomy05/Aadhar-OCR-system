import { Response } from "express";
import { CustomError } from "./customError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";


export const handleErrorResponse = (res: Response, error: unknown): Response => {
  if (error instanceof CustomError) {
    console.log("Custom Error:", error.message);

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof Error) {
    console.log("System Error:", error.message);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }

  console.log("Unknown Error:", error);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
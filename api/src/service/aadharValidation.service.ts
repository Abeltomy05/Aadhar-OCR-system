import { StatusCodes } from "http-status-codes";
import { aadhaarKeywords } from "../utils/constants/aadharKeywords";
import { ERROR_MESSAGES } from "../utils/constants/message";
import { CustomError } from "../utils/customError";
import { IAadhaarValidationService } from "../interface/serviceInterfaces/aadharValidationService.interface";
import { injectable } from "tsyringe";

@injectable()
export class AadhaarValidationService implements IAadhaarValidationService{
    validateAadhaarText(frontText: string, backText: string): void {
         const combinedText = (frontText + " " + backText).toLowerCase();

         const keywordCount = aadhaarKeywords.filter((k) => combinedText.includes(k)).length;

          if (keywordCount < 1) {
            throw new CustomError(ERROR_MESSAGES.NOT_AADHAAR_CARD, StatusCodes.BAD_REQUEST);
          }

          const aadhaarRegex = /\d{4}\s?\d{4}\s?\d{4}/;
          const matches = combinedText.match(aadhaarRegex); 

         if (!matches) {
           throw new CustomError(ERROR_MESSAGES.AADHAR_NO_NOT_FOUND, StatusCodes.BAD_REQUEST);
         } 

        const aadhaarNumber = matches[0];

        if (!/^\d{4}\s?\d{4}\s?\d{4}$/.test(aadhaarNumber)) {
          throw new CustomError(ERROR_MESSAGES.INVALID_AADHAAR_NUMBER, StatusCodes.BAD_REQUEST);
        }

        if (frontText.length < 100 && backText.length < 100) {
          throw new CustomError(ERROR_MESSAGES.INVALID_AADHAAR_IMAGE, StatusCodes.BAD_REQUEST);
        }
    }
}
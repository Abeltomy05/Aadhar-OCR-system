import { visionClient } from "../external/googleVision";
import fs from "fs";
import { IUserService } from "../interface/serviceInterfaces/authService.interface";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../utils/customError";
import { ERROR_MESSAGES } from "../utils/constants/message";
import { StatusCodes } from "http-status-codes";
import { IAadhaarValidationService } from "../interface/serviceInterfaces/aadharValidationService.interface";
import { enhanceImage } from "../utils/helper/sharp.helper";

export interface AadhaarData {
    name?: string;
    aadhaarNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
}

@injectable()
export class UserService implements IUserService{
    constructor(
      @inject("IAadhaarValidationService")
      private _aadharService: IAadhaarValidationService
    ){}

    async processAadhaarImages(frontImage: Express.Multer.File, backImage: Express.Multer.File): Promise<AadhaarData>{
      const enhancedFrontPath = await enhanceImage(frontImage.path);
      const enhancedBackPath = await enhanceImage(backImage.path);

      const [frontResult] = await visionClient.textDetection(enhancedFrontPath);
      const [backResult] = await visionClient.textDetection(enhancedBackPath);

      let frontText = 
        frontResult.fullTextAnnotation?.text || 
        frontResult.textAnnotations?.[0]?.description ||
        '';
      let backText = 
        backResult.fullTextAnnotation?.text || 
        backResult.textAnnotations?.[0]?.description ||
        '';

       // Retry OCR once if text is suspiciously short (Google Vision quirk)
      if (frontText.length < 50) {
        const [retryFront] = await visionClient.textDetection(enhancedFrontPath);
        frontText =
          retryFront.fullTextAnnotation?.text ||
          retryFront.textAnnotations?.[0]?.description ||
          frontText;
      }

      if (backText.length < 50) {
        const [retryBack] = await visionClient.textDetection(enhancedBackPath);
        backText =
          retryBack.fullTextAnnotation?.text ||
          retryBack.textAnnotations?.[0]?.description ||
          backText;
      }
  
      fs.unlinkSync(enhancedFrontPath); // Deleting temporary enhanced images
      fs.unlinkSync(enhancedBackPath);

      this._aadharService.validateAadhaarText(frontText,backText);

      const aadhaarRegex = /\d{4}\s?\d{4}\s?\d{4}/;

      const aadhaarFrontMatch = frontText.match(aadhaarRegex);
      const aadhaarBackMatch = backText.match(aadhaarRegex);

       if (!aadhaarFrontMatch || !aadhaarBackMatch) {
          throw new CustomError(ERROR_MESSAGES.AADHAR_NO_NOT_FOUND,StatusCodes.BAD_REQUEST);
        }

       const aadhaarNumber = aadhaarFrontMatch?.[0] || aadhaarBackMatch?.[0];

       const dobMatch = frontText.match(/(?:DOB|D0B|DoB|Date of Birth)[:\s]*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i);
       const dateOfBirth = dobMatch ? dobMatch[1] : '';

       const genderMatch = frontText.match(/\b(Male|Female|Others)\b/i);
       const gender = genderMatch ? genderMatch[1] : '';

       let name = '';
       if (dobMatch) {
          const lines = frontText.split("\n").map(l => l.trim()).filter(Boolean);
          const dobLineIndex = lines.findIndex(line => line.includes(dobMatch[1]));
           if (dobLineIndex > 0) {
               name = lines[dobLineIndex - 1];
           }
       }


       const addressRegex = /(Address[:]?)([\s\S]*?)(\d{4}\s\d{4}\s\d{4}|help@|www\.|$)/i;
       const addressMatch = backText.match(addressRegex);

       let address = '';
       if (addressMatch) {
         address = addressMatch[2].replace(/\n/g, " ").trim();
       }

       if (!address) {
          const pinRegex = /\b\d{6}\b/;
          const lines = backText.split("\n");
          const pinIndex = lines.findIndex(line => pinRegex.test(line));
          if (pinIndex >= 0) {
            address = lines.slice(0, pinIndex + 1).join(" ").trim();
          }
        }

        console.log("✅ Aadhaar Extracted:", { name, aadhaarNumber, dateOfBirth, gender, address });

       return {
          name,
          aadhaarNumber,
          dateOfBirth,
          gender,
          address,
        };
    }
}
import { visionClient } from "../external/googleVision";
import { IUserService } from "../interface/serviceInterfaces/authService.interface";
import { injectable } from "tsyringe";
import { CustomError } from "../utils/customError";
import { ERROR_MESSAGES } from "../utils/constants/message";
import { StatusCodes } from "http-status-codes";

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
    ){}

    async processAadhaarImages(frontImage: Express.Multer.File, backImage: Express.Multer.File): Promise<AadhaarData>{
      const [frontResult] = await visionClient.textDetection(frontImage.path);
      const [backResult] = await visionClient.textDetection(backImage.path);

      const frontText = frontResult.fullTextAnnotation?.text || '';
      const backText = backResult.fullTextAnnotation?.text || '';

      console.log('Front Aadhaar OCR:', frontText);
      console.log('Back Aadhaar OCR:', backText);

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

       console.log("Name:",name,"aadhaarNumber:",aadhaarNumber,"dateOfBirth:",dateOfBirth,"gender:",gender,"Address",address)

       return {
          name,
          aadhaarNumber,
          dateOfBirth,
          gender,
          address,
        };
    }
}
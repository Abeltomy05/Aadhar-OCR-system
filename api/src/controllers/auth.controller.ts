import { IUserController } from "../interface/controllerInterfaces/authcontroller.interface";
import { inject, injectable } from "tsyringe";
import { IUserService } from "../interface/serviceInterfaces/authService.interface";
import { Request,Response } from "express";
import { CustomError } from "../utils/customError";

@injectable()
export class UserController implements IUserController{
    constructor(
       @inject("IUserService")
       private _userService: IUserService
    ){}


     async uploadAadhar(req: Request, res: Response):Promise<void>{
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files?.frontImage?.[0] || !files?.backImage?.[0]) {
                res.status(400).json({
                    success: false,
                    message: 'Both front and back images are required'
                });
                return;
             }

             const frontImage = files.frontImage[0];
             const backImage = files.backImage[0];

             const result = await this._userService.processAadhaarImages(
                frontImage, 
                backImage
             );

             res.status(200).json({
                success: true,
                message: 'Aadhaar data extracted successfully',
                data: result
             });
        } catch (error) {
            console.error('Upload Aadhaar error:', error);

            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                success: false,
                message: error.message,
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error during Aadhaar processing'
            });
        }
    }
   
}
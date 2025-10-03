import { AadhaarData } from "../../service/user.service";


export interface IUserService{
    processAadhaarImages(frontImage: Express.Multer.File, backImage: Express.Multer.File): Promise<AadhaarData>
}
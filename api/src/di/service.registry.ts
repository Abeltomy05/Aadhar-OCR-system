import { container } from "tsyringe";
import { IUserService } from "../interface/serviceInterfaces/authService.interface";
import { UserService } from "../service/user.service";
import { IAadhaarValidationService } from "../interface/serviceInterfaces/aadharValidationService.interface";
import { AadhaarValidationService } from "../service/aadharValidation.service";

export class ServiceRegister{
    static registerService():void{
        container.register<IUserService>("IUserService",{
            useClass: UserService
        })
        container.register<IAadhaarValidationService>("IAadhaarValidationService",{
            useClass: AadhaarValidationService
        })
    }
}
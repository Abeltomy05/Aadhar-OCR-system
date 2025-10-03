import { container } from "tsyringe";
import { IUserService } from "../interface/serviceInterfaces/authService.interface";
import { UserService } from "../service/user.service";

export class ServiceRegister{
    static registerService():void{
        container.register<IUserService>("IUserService",{
            useClass: UserService
        })
    }
}
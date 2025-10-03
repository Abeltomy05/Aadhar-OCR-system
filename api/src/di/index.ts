import { container } from "tsyringe";
import { IUserController } from "../interface/controllerInterfaces/authcontroller.interface";
import { UserController } from "../controllers/auth.controller";
import { ServiceRegister } from "./service.registry";

export class DependencyInjection{
  static registerAll():void{
    ServiceRegister.registerService();
  }
}

DependencyInjection.registerAll();

 export const userController = container.resolve<IUserController>(UserController); 
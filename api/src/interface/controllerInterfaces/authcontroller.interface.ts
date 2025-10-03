import { Request,Response } from "express";

export interface IUserController{
   uploadAadhar(req: Request, res: Response):Promise<void>;
}
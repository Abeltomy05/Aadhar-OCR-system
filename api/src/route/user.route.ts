import { Router, Request, Response } from "express";
import { userController } from "../di";
import { upload } from "../config/multer";

class UserRoutes{
      public router: Router;
      constructor() {
            this.router = Router();
            this.initialRoutes();
       }

     initialRoutes(): void {

         this.router.post(
            "/upload-aadhar", 
            upload.fields([
                  { name: "frontImage", maxCount: 1 },
                  { name: "backImage", maxCount: 1 }
            ]),
            (req: Request, res: Response) => {
                  userController.uploadAadhar(req, res);
            }) 

     }  
}

export const userRoutes = new UserRoutes().router;



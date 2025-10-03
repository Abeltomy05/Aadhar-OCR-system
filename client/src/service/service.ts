import axiosInstance from "@/api/axios";
import { getErrorMessage } from "@/utils/error/error-handler";

export interface ApiResponse{
    success: boolean;
    message?: string;
    data?: any;
}

export const Service = {

    UploadAadhar: async(frontImage: File, backImage: File): Promise<ApiResponse>=>{
      try {
         const formData = new FormData();
         formData.append('frontImage', frontImage);
         formData.append('backImage', backImage);

         const response = await axiosInstance.post('/upload-aadhar', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
          });

         return response.data;
      } catch (error) {
        return {
            success: false,
            message:getErrorMessage(error),
            data:null
        }
      }
    }

}
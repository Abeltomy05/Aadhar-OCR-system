import toast from "react-hot-toast";

export const useToast = ()=>{
    const success = (message: string) => {
    toast.success(message, { duration: 5000 });
  };

  const error = (message: string) => {
    toast.error(message, { duration: 5000 });
  };

  const info = (message: string) => {
    toast(message, { duration: 5000 });
  };

  return { success, error, info };
}
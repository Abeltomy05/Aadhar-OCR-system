import dotenv from 'dotenv';
dotenv.config(); 

export const config = {
    PORT: process.env.PORT,
    ORIGIN: process.env.ORIGIN,
    isProduction: process.env.NODE_ENV === "production",
}
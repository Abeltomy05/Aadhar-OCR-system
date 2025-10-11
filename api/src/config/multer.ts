import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    }
});

export const upload = multer({ storage });
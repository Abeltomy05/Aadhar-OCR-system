🪪 Aadhaar OCR System using Google Vision API

This project is an Optical Character Recognition (OCR) system built to extract details from Aadhaar cards (India’s national ID) using the Google Vision API.
It reads text from Aadhaar card images, processes the extracted text, and identifies key information such as Name, Aadhaar Number, Date of Birth, and Gender.

🚀 Features
📷 Upload Aadhaar card image
🔍 Extract text using Google Cloud Vision API
🧠 Parse and identify key Aadhaar details:
Name
Aadhaar Number
Date of Birth / Year of Birth
Gender
⚙️ Built with Node.js (backend) and React (frontend)

⚙️ Setup Instructions:
1️⃣ Clone Repository
```
git clone https://github.com/Abeltomy05/Aadhar-OCR-system.git
cd aadhaar-ocr
```

2️⃣ Install Dependencies
```
npm install
```

3️⃣ Set Up Google Cloud Vision API
Go to Google Cloud Console.
Create a new project and enable Vision API.
Generate a Service Account Key (JSON file).
Save it locally and set the environment variable:
```
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-key.json"
```


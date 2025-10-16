export const OCR_LABELS = {
  uploadFront: "Upload front side",
  uploadBack: "Upload back side",
  extractData: "Extract Data",
  resetAll: "Reset All",
  noDataTitle: "No Data Extracted Yet",
  noDataDescription:
    'Upload both sides of your Aadhaar card and click "Extract Data" to see the extracted information here.',
};


export const OCR_MESSAGES = {
  invalidFile: "Only image files (JPG, PNG, etc.) are allowed.",
  uploadBoth: "Please upload both front and back images of the Aadhaar card.",
  copySuccess: "Copied to clipboard ✅",
  copyFail: "Failed to copy text",
  extractionFail: "Failed to extract data from Aadhaar card",
  processingError: "An error occurred while processing the Aadhaar card",
};


export const OCR_FIELDS = {
  name: "name",
  aadhaarNumber: "aadhaarNumber",
  dateOfBirth: "dateOfBirth",
  gender: "gender",
  address: "address",
};

export const DEFAULT_EXTRACTED_DATA = {
  name: "",
  aadhaarNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
};


export const OCR_BUTTONS = {
  extract: {
    label: "Extract Data",
    loading: "Processing...",
  },
  reset: {
    label: "Reset All",
  },
  copyAll: {
    label: "Copy All",
  },
};

export const OCR_SETTINGS = {
  maxFileSizeMB: 10,
  acceptedFileTypes: "image/*",
};
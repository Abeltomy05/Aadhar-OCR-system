import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileImage, Loader2, RotateCcw, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast.hook';
import { Service } from '@/service/service';
import { OCR_LABELS, OCR_MESSAGES, OCR_BUTTONS, OCR_SETTINGS } from '@/utils/constants/ocr.constants'

interface UploadedImage {
  file: File;
  preview: string;
}

interface ExtractedData {
  name?: string;
  aadhaarNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

const AadhaarOCRUploader: React.FC = () => {
  const [frontImage, setFrontImage] = useState<UploadedImage | null>(null);
  const [backImage, setBackImage] = useState<UploadedImage | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const { error, success } = useToast();

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    side: 'front' | 'back'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      const uploadedImage = { file, preview };

      if (side === 'front') {
        setFrontImage(uploadedImage);
      } else {
        setBackImage(uploadedImage);
      }
    } else {
      error(OCR_MESSAGES.invalidFile);
      event.target.value = '';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success(OCR_MESSAGES.copySuccess);
    } catch {
      error(OCR_MESSAGES.copyFail);
    }
  };

  const removeImage = (side: 'front' | 'back') => {
    if (side === 'front') {
      if (frontImage) {
        URL.revokeObjectURL(frontImage.preview);
        setFrontImage(null);
      }
      if (frontInputRef.current) {
        frontInputRef.current.value = '';
      }
    } else {
      if (backImage) {
        URL.revokeObjectURL(backImage.preview);
        setBackImage(null);
      }
      if (backInputRef.current) {
        backInputRef.current.value = '';
      }
    }
  };

  const handleOCRProcess = async () => {
    if (!frontImage || !backImage) {
      alert(OCR_MESSAGES.uploadBoth);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await Service.UploadAadhar(frontImage.file, backImage.file);
      if (response.success) {
        setExtractedData(response.data);
      } else {
        throw new Error(response.message || OCR_MESSAGES.extractionFail);
      }
    } catch (err) {
      console.error('Error processing Aadhaar:', err);
      const errorMessage =
        err instanceof Error ? err.message : OCR_MESSAGES.processingError;
      error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    removeImage('front');
    removeImage('back');
    setExtractedData(null);
  };

  return (
    <div className="h-screen bg-gray-50 p-2">
      <div className="max-w-6xl mx-auto h-full">
        <div className="grid lg:grid-cols-3 gap-4 h-full">
          {/* Upload Section - Left Side */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="">
                <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {OCR_LABELS.uploadFront.split(' ')[0]} Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {/* Front Side Upload */}
                <Card className="border-dashed">
                  <CardHeader className="">
                    <CardTitle className="text-sm">Front Side</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors min-h-[150px] flex flex-col justify-center">
                      {frontImage ? (
                        <div className="relative">
                          <img
                            src={frontImage.preview}
                            alt="Aadhaar Front"
                            className="max-w-full h-24 object-contain mx-auto rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage('front')}
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <FileImage className="mx-auto h-6 w-6 text-gray-400" />
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">{OCR_LABELS.uploadFront}</p>
                          </div>
                        </div>
                      )}
                      <input
                        ref={frontInputRef}
                        type="file"
                        accept={OCR_SETTINGS.acceptedFileTypes}
                        onChange={(e) => handleImageUpload(e, 'front')}
                        className="hidden"
                      />
                      {!frontImage && (
                        <Button
                          onClick={() => frontInputRef.current?.click()}
                          className="mt-2"
                          size="sm"
                        >
                          Choose File
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Back Side Upload */}
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Back Side</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors min-h-[150px] flex flex-col justify-center">
                      {backImage ? (
                        <div className="relative">
                          <img
                            src={backImage.preview}
                            alt="Aadhaar Back"
                            className="max-w-full h-24 object-contain mx-auto rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage('back')}
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <FileImage className="mx-auto h-6 w-6 text-gray-400" />
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">{OCR_LABELS.uploadBack}</p>
                          </div>
                        </div>
                      )}
                      <input
                        ref={backInputRef}
                        type="file"
                        accept={OCR_SETTINGS.acceptedFileTypes}
                        onChange={(e) => handleImageUpload(e, 'back')}
                        className="hidden"
                      />
                      {!backImage && (
                        <Button
                          onClick={() => backInputRef.current?.click()}
                          className="mt-2"
                          size="sm"
                        >
                          Choose File
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleOCRProcess}
                    disabled={!frontImage || !backImage || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {OCR_BUTTONS.extract.loading}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {OCR_BUTTONS.extract.label}
                      </>
                    )}
                  </Button>

                  <Button onClick={resetAll} variant="outline" className="w-full">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {OCR_BUTTONS.reset.label}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Extracted Data Display - Right Side */}
          <div className="lg:col-span-2">
            {extractedData ? (
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Extracted Information
                  </CardTitle>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = `
                Name: ${extractedData?.name || 'Not found'}
                Aadhaar Number: ${extractedData?.aadhaarNumber || 'Not found'}
                DOB: ${extractedData?.dateOfBirth || 'Not found'}
                Gender: ${extractedData?.gender || 'Not found'}
                Address: ${extractedData?.address || 'Not found'}
                      `.trim();
                      copyToClipboard(text);
                    }}
                  >
                    {OCR_BUTTONS.copyAll.label}
                  </Button>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-600">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={extractedData.name || 'Not found'}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aadhaar" className="text-sm font-medium text-gray-600">
                          Aadhaar Number
                        </Label>
                        <Input
                          id="aadhaar"
                          value={extractedData.aadhaarNumber || 'Not found'}
                          readOnly
                          className="bg-gray-50 font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-sm font-medium text-gray-600">
                          Date of Birth
                        </Label>
                        <Input
                          id="dob"
                          value={extractedData.dateOfBirth || 'Not found'}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium text-gray-600">
                          Gender
                        </Label>
                        <Input
                          id="gender"
                          value={extractedData.gender || 'Not found'}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-600">
                          Address
                        </Label>
                        <div
                          id="address"
                          className="w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm text-gray-800"
                        >
                          {extractedData.address || 'Not found'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full border-dashed">
                <CardContent className="flex items-center justify-center h-full min-h-[500px]">
                  <div className="text-center space-y-6">
                    <FileImage className="mx-auto h-16 w-16 text-gray-300" />
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-500">
                        {OCR_LABELS.noDataTitle}
                      </h3>
                      <p className="text-base text-gray-500 max-w-lg mx-auto">
                        {OCR_LABELS.noDataDescription}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AadhaarOCRUploader;
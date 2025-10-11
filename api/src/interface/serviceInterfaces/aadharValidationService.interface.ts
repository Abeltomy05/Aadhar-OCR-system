

export interface IAadhaarValidationService{
    validateAadhaarText(frontText: string, backText: string): void;
}
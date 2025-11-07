import vision from '@google-cloud/vision';
import { config } from '../config/env';

const credentials = JSON.parse(config.GOOGLE_CREDENTIALS_JSON!);
export const visionClient = new vision.ImageAnnotatorClient({ credentials });
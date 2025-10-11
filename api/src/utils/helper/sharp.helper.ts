import sharp from "sharp";
import path from "path";

export async function enhanceImage(filePath: string): Promise<string> {
  const tempEnhancedPath = path.join(
    path.dirname(filePath),
    `enhanced-${path.basename(filePath)}`
  );

  await sharp(filePath)
    .resize({ width: 1000 })
    .grayscale()
    .sharpen()
    .toFile(tempEnhancedPath);

  return tempEnhancedPath;
}
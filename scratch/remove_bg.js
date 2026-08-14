const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImage() {
  const inputPath = 'C:\\Users\\ANINDYA\\.gemini\\antigravity\\brain\\ec199a96-94f6-46d8-be5b-5ac0f4c44ffd\\cta_student_blue_1786747026862.jpg';
  const outputPath = 'd:\\Exam Ready 2026\\Froentend\\exam-ready\\public\\images\\cta-student.png';

  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  // Data is RGB (3 bytes per pixel)
  const numPixels = width * height;
  const rgbaData = Buffer.alloc(numPixels * 4);

  for (let i = 0; i < numPixels; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];

    rgbaData[i * 4] = r;
    rgbaData[i * 4 + 1] = g;
    rgbaData[i * 4 + 2] = b;

    // Check if pixel is part of the blue studio background
    // Blue background keying condition
    const isBlueBg = (b > 150) && (b > r + 50) && (b > g + 30);

    if (isBlueBg) {
      rgbaData[i * 4 + 3] = 0; // Transparent
    } else {
      // Check for fringe pixels
      const blueDiff = b - Math.max(r, g);
      if (blueDiff > 30) {
        // Feather alpha slightly for smooth edge
        const alpha = Math.max(0, Math.min(255, Math.floor(255 - (blueDiff - 30) * 5)));
        rgbaData[i * 4 + 3] = alpha;
      } else {
        rgbaData[i * 4 + 3] = 255; // Opaque
      }
    }
  }

  await sharp(rgbaData, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log('Processed transparent PNG successfully!');
}

processImage().catch(console.error);

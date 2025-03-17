const sharp = require('sharp');
const path = require('path');

const sizes = [
  { size: 192, name: 'logo192.png' },
  { size: 512, name: 'logo512.png' },
  { size: 32, name: 'favicon.ico' }
];

async function generateIcons() {
  const inputFile = path.join(__dirname, '../public/logo.svg');

  for (const { size, name } of sizes) {
    const outputFile = path.join(__dirname, '../public', name);
    
    await sharp(inputFile)
      .resize(size, size)
      .toFile(outputFile);
    
    console.log(`Generated ${name} (${size}x${size})`);
  }
}

generateIcons().catch(console.error);

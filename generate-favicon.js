const fs = require('fs');
const sharp = require('sharp');
const toIco = require('to-ico');

async function generateFavicon() {
  try {
    // Read the 192x192 PNG
    const input = fs.readFileSync('./public/android-chrome-192x192.png');
    
    // Create multiple sizes for ICO (16, 32, 48)
    const sizes = [16, 32, 48];
    const buffers = await Promise.all(
      sizes.map(size =>
        sharp(input)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );
    
    // Convert to ICO
    const ico = await toIco(buffers);
    
    // Write to public folder
    fs.writeFileSync('./public/favicon.ico', ico);
    
    console.log('✅ favicon.ico created successfully!');
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();

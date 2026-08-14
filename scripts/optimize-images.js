const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const imagesToOptimize = ['loc-1.jpg', 'loc-2.jpg', 'loc-3.jpg', 'loc-4.jpg', 'loc-5.jpg', 'flights-hero.jpg'];

async function optimizeImages() {
    for (const image of imagesToOptimize) {
        const inputPath = path.join(publicDir, image);
        if (!fs.existsSync(inputPath)) {
            console.log(`Skipping ${image} - not found`);
            continue;
        }

        const tempOutputPath = path.join(publicDir, `optimized-${image}`);

        try {
            console.log(`Optimizing ${image}...`);
            await sharp(inputPath)
                .resize({ width: 1920, withoutEnlargement: true }) // Max width for heroes
                .jpeg({ quality: 80, progressive: true })
                .toFile(tempOutputPath);

            // Replace original
            fs.unlinkSync(inputPath);
            fs.renameSync(tempOutputPath, inputPath);
            console.log(`Finished ${image}`);
        } catch (error) {
            console.error(`Error processing ${image}:`, error);
        }
    }
}

optimizeImages();

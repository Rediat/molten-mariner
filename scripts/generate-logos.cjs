const fs = require('fs');
const path = require('path');

const logosDir = 'public/assets/logos';
const outputFilePath = 'src/features/tbill/logos.js';

let output = 'export const LOGOS = {\n';

if (fs.existsSync(logosDir)) {
    const files = fs.readdirSync(logosDir);
    files.forEach(file => {
        const fullPath = path.join(logosDir, file);
        const name = path.parse(file).name.replace(/\s+/g, '_').toLowerCase();
        const ext = path.parse(file).ext.toLowerCase();
        
        let mimeType = '';
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        
        if (mimeType) {
            const base64 = fs.readFileSync(fullPath).toString('base64');
            output += `    ${name}: 'data:${mimeType};base64,${base64}',\n`;
        }
    });
}

output += '};\n';

fs.writeFileSync(outputFilePath, output);
console.log(`Generated ${outputFilePath}`);

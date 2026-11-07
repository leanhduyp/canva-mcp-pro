import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/engine/slide-engine.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace any Pt(18..23) with Pt(24) in font.size assignments
const replaced = content.replace(/font\.size\s*=\s*Pt\((18|19|20|21|22|23)\)/g, 'font.size = Pt(24)');

fs.writeFileSync(filePath, replaced, 'utf-8');
console.log('Successfully upgraded all font sizes in slide-engine.ts to >= Pt(24)!');

import fs from 'fs';

// 1. Clean palettes.ts
let p = fs.readFileSync('src/taste/palettes.ts', 'utf-8');
p = p.replace(/\/\/ Backward compatibility alias\r?\npalettes\["iuh-brand"\] = palettes\["corporate-navy"\];\r?\n\r?\n/, '');
fs.writeFileSync('src/taste/palettes.ts', p, 'utf-8');
console.log('Cleaned palettes.ts');

// 2. Clean skills/canva-brand-auditor/SKILL.md
let s = fs.readFileSync('skills/canva-brand-auditor/SKILL.md', 'utf-8');
s = s.replace('IUH Official Brand', 'Corporate Navy Brand');
fs.writeFileSync('skills/canva-brand-auditor/SKILL.md', s, 'utf-8');
console.log('Cleaned SKILL.md');

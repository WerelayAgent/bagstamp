const fs = require('fs');
const path = require('path');

function processFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fp = path.join(dir, file);
        if (fs.statSync(fp).isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== '.next') {
                processFiles(fp);
            }
        } else if (fp.endsWith('.html') || fp.endsWith('.js') || fp.endsWith('.json') || fp.endsWith('.txt') || fp.endsWith('.tsx') || fp.endsWith('.ts')) {
            let content = fs.readFileSync(fp, 'utf8');
            let original = content;
            
            // Replace "0x1f120B9fc0740E5DDC26bFb056B13f74A865BE7d" with the new CA
            content = content.replace(/0x1f120B9fc0740E5DDC26bFb056B13f74A865BE7d/gi, '0x1f120B9fc0740E5DDC26bFb056B13f74A865BE7d');
            
            if (content !== original) {
                fs.writeFileSync(fp, content);
                console.log('Replaced placeholder with CA in', fp);
            }
        }
    }
}
processFiles('.');
console.log('Done.');

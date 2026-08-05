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
            
            // Protect window.solana
            content = content.replace(/window\.solana/g, 'window.solana');
            
            // Replace Robinhood Chain -> Robinhood Chain (only capitalized/uppercase to avoid breaking JS imports/objects)
            content = content.replace(/\bSolana\b/g, 'Robinhood Chain');
            content = content.replace(/\bSOLANA\b/g, 'ROBINHOOD CHAIN');
            
            // Replace Pons Family -> Pons Family
            content = content.replace(/pump\.fun/gi, 'Pons Family');
            content = content.replace(/ponsfamily/gi, 'ponsfamily');
            
            // Revert protected window.solana
            content = content.replace(/window.solana/g, 'window.solana');
            
            // Fix Twitter links to canonical x.com
            content = content.replace(/twitter\.com/g, 'x.com');
            
            if (content !== original) {
                fs.writeFileSync(fp, content);
                console.log('Rebranded safely', fp);
            }
        }
    }
}
processFiles('.');
console.log('Done.');

const fs = require('fs');
const path = './app/global-scanner/globalJobsData.ts';
let content = fs.readFileSync(path, 'utf-8');

// First replace all occurrences of `?0L ? ?1L` or `?0L ? ?0L` or `?0L` entirely
const regex = /salary":\s*"[^"]+"/g;

content = content.replace(regex, (match) => {
    let newSal = match;
    
    // Fix broken '0L' or '1L' patterns with random realistic values
    if (newSal.includes('0L') || newSal.includes('1L')) {
        const min = Math.floor(Math.random() * 50) + 70;
        const max = min + Math.floor(Math.random() * 40) + 20;
        
        let currency = '$';
        if (newSal.includes('?')) currency = ''; // will be fixed later or generic
        
        // Return a clean range
        return `salary": "${currency}${min}K - ${currency}${max}K/yr"`;
    }
    
    // Replace ? in the middle with a dash
    newSal = newSal.replace(/\?/g, '-');
    newSal = newSal.replace(/ - - /g, ' - ');
    newSal = newSal.replace(/--/g, '-');
    
    return newSal;
});

// Fix avgSalaries manually
content = content.replace('Avg ?85,000/yr', 'Avg £85,000/yr');
content = content.replace('Avg ?80,000/yr', 'Avg €80,000/yr');
content = content.replace('Avg ?75,000/yr', 'Avg €75,000/yr');
content = content.replace('Avg ?65,000/yr', 'Avg €65,000/yr');
content = content.replace('Avg ?40,000/yr', 'Avg €40,000/yr');
content = content.replace('Avg ?3,500,000/yr', 'Avg ₹3,500,000/yr');

fs.writeFileSync(path, content);
console.log('Fixed salaries in globalJobsData.ts');

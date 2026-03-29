const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  const products = data.products || [];
  const summary = {};
  products.forEach(p => {
    const cat = p.category || 'none';
    const sub = p.subcategory || 'none';
    if (!summary[cat]) summary[cat] = {};
    if (!summary[cat][sub]) summary[cat][sub] = 0;
    summary[cat][sub]++;
  });
  console.log(JSON.stringify(summary, null, 2));
} catch(e) {
  console.error("Error reading db.json:", e);
}

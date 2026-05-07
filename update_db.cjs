const fs = require('fs');
const path = './db.json';

try {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  
  data.products = data.products.map(p => {
    // 1. Normalize categories
    if (p.category === 'kids') p.category = 'girls';
    
    const cat = p.category;
    let sub = p.subcategory;
    
    // 2. Normalize subcategories based on category
    if (cat === 'infant') {
      if (['rompers', 'sets'].includes(sub)) sub = 'rompers';
      else if (['onesies'].includes(sub)) sub = 'onesies';
      else if (['dresses'].includes(sub)) sub = 'summer';
      else if (['layette', 'frocks', 'party_wear'].includes(sub)) sub = 'party-occasion';
      else sub = 'rompers'; // fallback
    } 
    else if (cat === 'toddler') {
      if (['frocks', 'party_wear'].includes(sub)) sub = 'party';
      else if (['a-line', 'tops', 'rompers', 'sets'].includes(sub)) sub = 'casual';
      else if (['ethnic'].includes(sub)) sub = 'ethnic';
      else if (['summer'].includes(sub)) sub = 'summer';
      else if (['winter'].includes(sub)) sub = 'winter';
      else sub = 'casual'; // fallback
    }
    else if (cat === 'girls') {
      if (['party wear', 'frocks', 'party_wear'].includes(sub)) sub = 'party';
      else if (['ethnic'].includes(sub)) sub = 'ethnic';
      else if (['summer'].includes(sub)) sub = 'summer';
      else if (['winter'].includes(sub)) sub = 'winter';
      else sub = 'casual'; // fallback
    }
    
    p.subcategory = sub;
    return p;
  });

  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync('public/data/db.json', JSON.stringify(data, null, 2), 'utf8');
  console.log("Database perfectly normalized and synced!");
} catch(e) {
  console.error("Error migrating db.json:", e);
}

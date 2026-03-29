const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
console.log('Reading db.json...');
const dbStr = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(dbStr);

// A simple dictionary to map unpredictable search terms to the words actually in the products
const SYNONYMS = {
  "sweater": ["pullover", "cardigan", "jumper", "fleece", "knit", "warm top", "hoodie", "sweatshirt"],
  "winter": ["cold", "snow", "warm", "fleece", "heavy", "jacket", "coat", "sweater", "cardigan", "hoodie", "thermal"],
  "infant": ["baby", "newborn", "0-24m", "onesie", "romper"],
  "toddler": ["kids", "child", "2t", "3t", "4t", "5t"],
  "dress": ["frock", "gown", "skirt"],
  "pants": ["trousers", "jeans", "bottoms", "leggings", "joggers", "sweatpants"],
  "shirt": ["tee", "t-shirt", "top", "blouse", "polo"],
  "shoes": ["sneakers", "boots", "sandals", "footwear", "kicks", "shoes"],
  "party": ["formal", "fancy", "wedding", "celebration", "birthday", "elegant"],
  "summer": ["hot", "beach", "lightweight", "sleeveless", "shorts", "swim", "swimsuit"]
};

db.products = db.products.map(p => {
  // Combine all searchable fields into an array
  const rawParts = [
    p.title,
    p.category,
    p.subcategory,
    p.fabric,
    ...(p.tags || []),
    p.description
  ].filter(Boolean).map(str => String(str).toLowerCase().trim());
  
  // Create a combined string of the original content
  const originalText = rawParts.join(' ');
  const finalTags = new Set(rawParts);

  // Check against our synonym dictionary using word boundary regex
  for (const ObjectEntry of Object.entries(SYNONYMS)) {
    const targetWord = ObjectEntry[0];
    const triggers = ObjectEntry[1];
    
    try {
      // Create word boundary regex to avoid partial matches (e.g. "hot" inside "photo")
      const hasTarget = new RegExp(`\\b${targetWord}\\b`, 'i').test(originalText);
      const hasTrigger = triggers.some(t => new RegExp(`\\b${t}\\b`, 'i').test(originalText));
      
      // If the product IS a sweater, also tag it with pullover, cardigan, etc.
      if (hasTarget) {
        triggers.forEach(t => finalTags.add(t));
      }
      
      // If the product IS a cardigan, also tag it with sweater!
      if (hasTrigger) {
        finalTags.add(targetWord);
      }
    } catch (e) {
      // fail silently on bad regex strings
    }
  }

  // Save the enriched text block
  p.search_text = Array.from(finalTags).join(' ').replace(/\s+/g, ' ');
    
  return p;
});

console.log('Writing back to db.json...');
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully added ENHANCED synonym search_text index to ${db.products.length} products!`);

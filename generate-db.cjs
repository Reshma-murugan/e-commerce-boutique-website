// Run: node generate-db.js
const fs = require('fs');

const CATEGORIES = {
  infant: {
    subcategories: ['rompers', 'onesies', 'summer', 'party', 'winter'],
    sizes: {
      rompers: ['0-3M','3-6M','6-12M'],
      onesies: ['0-3M','3-6M','6-12M'],
      summer:  ['3-6M','6-12M','12-18M'],
      party:   ['0-3M','3-6M','6-12M','12-18M'],
      winter:  ['0-3M','3-6M','6-12M','12-18M'],
    },
  },
  toddler: {
    subcategories: ['casual', 'party', 'festive', 'summer', 'winter'],
    sizes: {
      casual:  ['2Y','3Y','4Y','5Y'],
      party:   ['2Y','3Y','4Y'],
      festive: ['2Y','3Y','4Y','5Y'],
      summer:  ['2Y','3Y','4Y'],
      winter:  ['2Y','3Y','4Y','5Y'],
    },
  },
  girls: {
    subcategories: ['casual', 'party', 'festive', 'winter', 'summer'],
    sizes: {
      casual:  ['6','8','10','12','14'],
      party:   ['6','8','10','12'],
      festive: ['6','8','10','12','14'],
      winter:  ['6','8','10','12','14'],
      summer:  ['6','8','10','12','14'],
    },
  },
};

const TITLES = {
  infant: {
    rompers: ['Floral Snap Romper','Polka Dot Romper','Striped Bodysuit Romper','Bunny Print Romper','Rainbow Romper','Daisy Romper','Cloud Print Romper','Star Romper','Heart Romper','Butterfly Romper','Gingham Romper','Lace Trim Romper','Ruffle Romper','Bow Romper','Cherry Romper'],
    onesies: ['Soft Cotton Onesie','Organic Onesie','Printed Onesie','Sleeveless Onesie','Long Sleeve Onesie','Snap Button Onesie','Ribbed Onesie','Velvet Onesie','Knit Onesie','Floral Onesie','Striped Onesie','Polka Dot Onesie','Plain White Onesie','Pastel Onesie','Animal Print Onesie'],
    summer:  ['Baby Summer Dress','Floral Sundress','Sleeveless Baby Dress','Cotton Frock','Smocked Dress','Ruffle Sundress','Linen Baby Dress','Printed Summer Frock','Bow Tie Dress','Tiered Baby Dress','Eyelet Dress','Broderie Dress','Puff Sleeve Dress','Halter Neck Dress','Wrap Dress'],
    party:   ['Tutu Party Set','Lace Occasion Dress','Satin Party Dress','Sequin Baby Dress','Tulle Frock','Bow Party Dress','Embroidered Occasion Set','Ruffle Party Dress','Floral Party Frock','Pearl Trim Dress','Velvet Party Dress','Organza Dress','Chiffon Party Set','Glitter Dress','Princess Party Frock'],
    winter:  ['Fleece Bodysuit','Woolen Romper','Knit Winter Dress','Thermal Onesie','Quilted Jacket Set','Velvet Winter Frock','Sherpa Romper','Cable Knit Dress','Hooded Winter Set','Plush Bodysuit','Corduroy Dress','Padded Winter Romper','Fur Trim Dress','Cozy Knit Set','Warm Fleece Dress'],
  },
  toddler: {
    casual:  ['Denim Overall Set','Rainbow Tee Set','Polka Dot Dress','Casual Playtime Set','Striped Jumpsuit','Printed Tee Dress','Linen Shorts Set','Graphic Tee Set','Floral Casual Dress','Ruffle Tee Dress','Denim Pinafore','Cotton Skirt Set','Tie Dye Dress','Patchwork Dress','Smocked Casual Dress'],
    party:   ['Toddler Party Dress','Tulle Birthday Dress','Sequin Party Frock','Satin Bow Dress','Ruffle Party Set','Lace Party Dress','Glitter Tutu Dress','Organza Party Frock','Velvet Party Dress','Embellished Dress','Floral Party Dress','Tiered Party Frock','Puff Sleeve Party Dress','Bow Back Dress','Princess Party Dress'],
    festive: ['Flower Crown Dress','Embroidered Festive Set','Ethnic Print Dress','Mirror Work Dress','Block Print Frock','Bandhani Dress','Ikat Print Dress','Chanderi Dress','Silk Blend Frock','Zari Border Dress','Phulkari Dress','Kalamkari Frock','Ajrakh Print Dress','Batik Dress','Jaipuri Print Frock'],
    summer:  ['Toddler Sundress','Floral Maxi Dress','Sleeveless Frock','Cotton Sundress','Printed Summer Dress','Ruffle Sundress','Linen Dress','Smocked Sundress','Eyelet Sundress','Tropical Print Dress','Gingham Sundress','Stripe Sundress','Broderie Sundress','Pom Pom Dress','Tassel Dress'],
    winter:  ['Woolen Dress','Knit Sweater Dress','Corduroy Pinafore','Velvet Winter Dress','Fleece Dress','Quilted Jacket Dress','Cable Knit Frock','Sherpa Dress','Thermal Dress Set','Plaid Dress','Fur Collar Dress','Padded Dress','Hooded Dress','Turtleneck Dress','Ribbed Knit Dress'],
  },
  girls: {
    casual:  ['Denim Jacket & Skirt','Sporty Activewear Set','Vintage Floral Blouse','Tiered Ruffle Dress','Fit & Flare School Dress','Casual Everyday Outfit','Graphic Tee Dress','Denim Pinafore Dress','Linen Co-ord Set','Striped Shirt Dress','Floral Midi Dress','Cotton Maxi Dress','Smocked Casual Dress','Patchwork Denim Dress','Tie Dye Maxi'],
    party:   ['Princess Ball Gown','Elegant Lace Dress','Tulle Party Dress','Sequin Birthday Dress','Satin Gown','Ruffle Party Dress','Glitter Maxi Dress','Organza Ball Gown','Velvet Party Dress','Embellished Gown','Floral Party Dress','Tiered Tulle Gown','Off Shoulder Dress','Bow Back Gown','Mermaid Party Dress'],
    festive: ['Anarkali Festive Suit','Lehenga Choli Set','Embroidered Kurta Set','Silk Salwar Suit','Chanderi Anarkali','Bandhani Lehenga','Zardozi Dress','Mirror Work Lehenga','Phulkari Suit','Kalamkari Anarkali','Ikat Lehenga Set','Block Print Kurta','Banarasi Lehenga','Kanjivaram Dress','Patola Print Suit'],
    winter:  ['Woolen Pinafore Dress','Velvet Winter Dress','Cable Knit Dress','Corduroy Dress','Fleece Lined Dress','Quilted Jacket Dress','Sherpa Coat Dress','Plaid Midi Dress','Turtleneck Dress','Fur Trim Dress','Thermal Dress Set','Padded Dress','Hooded Dress','Ribbed Knit Dress','Sweater Dress'],
    summer:  ['Floral Summer Maxi','Sundress Beach Maxi','Sleeveless Maxi Dress','Cotton Sundress','Tropical Print Dress','Ruffle Sundress','Linen Maxi Dress','Smocked Sundress','Eyelet Maxi Dress','Gingham Sundress','Stripe Maxi Dress','Broderie Dress','Pom Pom Maxi','Off Shoulder Sundress','Wrap Maxi Dress'],
  },
};

const DESCRIPTIONS = {
  rompers:  ['Easy snap-button romper in a cheerful print. Machine washable and skin-safe.','Adorable romper with soft cotton fabric for all-day comfort.','Cute snap-on romper perfect for your little one\'s everyday adventures.'],
  onesies:  ['Super soft cotton onesie with snap buttons for easy diaper changes.','Gentle on baby\'s skin with breathable organic cotton fabric.','Classic onesie in a fun print, easy to wear and easy to wash.'],
  summer:   ['Light and breezy summer dress with delicate patterns. Perfect for warm weather.','Airy sleeveless dress in a cheerful floral print for sunny days.','Beautiful summer frock with comfortable elastic waist and soft lining.'],
  party:    ['Gorgeous party dress with layers of tulle and sparkle details.','Stunning occasion dress perfect for birthdays and special events.','Glamorous party frock with sequin details that catches every light.'],
  winter:   ['Warm fleece bodysuit to keep your little one snug during cold months.','Soft woolen dress with a cozy knit texture, perfect for winter outings.','Rich velvet dress combining warmth and elegance for winter occasions.'],
  casual:   ['Comfortable everyday outfit perfect for school and play.','Trendy casual set with durable fabric built for active kids.','Versatile everyday dress that pairs well with any footwear.'],
  festive:  ['Beautifully embroidered festive outfit perfect for celebrations.','Vibrant ethnic wear with traditional mirror work and embroidery.','Stunning festive dress with intricate handwork and rich fabric.'],
};

// Each product gets a unique Picsum image based on its ID (seed = deterministic, always same image per product)
function getImages(productId) {
  return [
    `https://picsum.photos/seed/ar-${productId}-1/400/500`,
    `https://picsum.photos/seed/ar-${productId}-2/400/500`,
    `https://picsum.photos/seed/ar-${productId}-3/400/500`,
    `https://picsum.photos/seed/ar-${productId}-4/400/500`,
  ];
}

// Price ranges per category
const PRICE_RANGES = {
  infant:  { min: 349, max: 999  },
  toddler: { min: 499, max: 1499 },
  girls:   { min: 699, max: 3999 },
};

// Subcategory price multipliers
const SUB_MULTIPLIERS = {
  rompers: 1.0, onesies: 0.85, summer: 1.0, party: 1.4, winter: 1.2,
  casual: 1.0, festive: 1.6, girls_party: 1.5,
};

// Each product gets a unique Picsum image based on its ID (seed = deterministic, always same image per product)
function getImages(productId) {
  return [
    `https://picsum.photos/seed/ar-${productId}-1/400/500`,
    `https://picsum.photos/seed/ar-${productId}-2/400/500`,
    `https://picsum.photos/seed/ar-${productId}-3/400/500`,
    `https://picsum.photos/seed/ar-${productId}-4/400/500`,
  ];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function roundToNearest(n, nearest = 50) {
  return Math.round(n / nearest) * nearest - 1;
}

const products = [];
let id = 1;

// Generate ~500 products distributed across categories
const TARGET = 500;
const catKeys = Object.keys(CATEGORIES);

// Distribute: infant ~150, toddler ~150, girls ~200
const DIST = { infant: 150, toddler: 150, girls: 200 };

for (const cat of catKeys) {
  const { subcategories, sizes } = CATEGORIES[cat];
  const total = DIST[cat];
  const perSub = Math.floor(total / subcategories.length);

  for (const sub of subcategories) {
    const titlePool = TITLES[cat][sub];
    const descPool = DESCRIPTIONS[sub] || DESCRIPTIONS['casual'];
    const sizeList = sizes[sub];
    const { min, max } = PRICE_RANGES[cat];
    const mult = SUB_MULTIPLIERS[sub] || SUB_MULTIPLIERS[cat + '_' + sub] || 1.0;

    for (let i = 0; i < perSub; i++) {
      const basePrice = rand(min, max);
      const price = roundToNearest(basePrice * mult);
      const discountPct = pick([10, 15, 20, 22, 25, 27, 28, 30, 33, 35, 40]);
      const originalPrice = roundToNearest(price / (1 - discountPct / 100));
      const rating = (rand(38, 50) / 10).toFixed(1);
      const reviewCount = rand(12, 1200);
      const isNew = Math.random() < 0.2;
      const isBestSeller = Math.random() < 0.25;

      // Pick a title — cycle through pool with variation
      const titleBase = titlePool[i % titlePool.length];
      const colors = ['Pink','Blue','White','Cream','Peach','Lavender','Mint','Yellow','Red','Purple','Orange','Teal','Coral','Ivory','Rose'];
      const title = `${pick(colors)} ${titleBase}`;

      const imgs = getImages(id);
      products.push({
        id,
        title,
        price,
        originalPrice,
        discount: discountPct,
        rating: parseFloat(rating),
        reviewCount,
        isNew,
        isBestSeller,
        category: cat,
        subcategory: sub,
        sizes: sizeList,
        image: imgs[0],
        images: imgs,
        description: pick(descPool),
      });

      id++;
    }
  }
}

// Top up to exactly 500 if needed
while (products.length < TARGET) {
  const cat = pick(catKeys);
  const sub = pick(CATEGORIES[cat].subcategories);
  const titlePool = TITLES[cat][sub];
  const descPool = DESCRIPTIONS[sub] || DESCRIPTIONS['casual'];
  const sizeList = CATEGORIES[cat].sizes[sub];
  const { min, max } = PRICE_RANGES[cat];
  const price = roundToNearest(rand(min, max));
  const discountPct = pick([15, 20, 25, 30]);
  const originalPrice = roundToNearest(price / (1 - discountPct / 100));

  const imgs2 = getImages(id);
  products.push({
    id,
    title: `${pick(['Pink','Blue','White','Cream','Peach'])} ${pick(titlePool)}`,
    price,
    originalPrice,
    discount: discountPct,
    rating: parseFloat((rand(38, 50) / 10).toFixed(1)),
    reviewCount: rand(12, 800),
    isNew: Math.random() < 0.2,
    isBestSeller: Math.random() < 0.25,
    category: cat,
    subcategory: sub,
    sizes: sizeList,
    image: imgs2[0],
    images: imgs2,
    description: pick(descPool),
  });
  id++;
}

fs.writeFileSync('db.json', JSON.stringify({ products }, null, 2));
fs.writeFileSync('public/data/db.json', JSON.stringify({ products }, null, 2));
console.log(`✅ Generated ${products.length} products → db.json & public/data/db.json`);

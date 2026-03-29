const fs   = require("fs");
const https = require("https");

const PEXELS_KEY = "N4mPiZn2YTLRaQmZYUoT0UP3SW9nvarhwbYHiNRYyMJNuUikxAUQq4rR";

// ── Per-subcategory search queries for accurate images ──────────────────────
const SUBCATEGORY_QUERIES = {
  // infant
  "onesies":      "baby onesie infant bodysuit",
  "rompers":      "baby girl romper bodysuit",
  "dresses":      "baby girl dress infant",
  "layette":      "newborn layette baby set",
  // toddler
  "a-line":       "toddler girl a-line dress",
  "party-frock":  "toddler girl party dress frock",
  "pinafore":     "toddler girl pinafore dress",
  "smocked":      "toddler smocked dress girl",
  // girls
  "tutu":         "girls tutu dress ballet",
  "tiered":       "girls tiered ruffle dress",
  "maxi":         "girls maxi dress long",
  "shirt-dress":  "girls shirt dress denim",
  "sweatshirt":   "girls sweatshirt dress casual",
  "empire-line":  "girls empire waist dress",
};

// ── Category config ─────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "infant",
    subcategories: ["onesies", "rompers", "dresses", "layette"],
    sizes: ["0-3M", "3-6M", "6-12M", "12-18M"],
    priceRange: [299, 899],
  },
  {
    name: "toddler",
    subcategories: ["a-line", "party-frock", "pinafore", "smocked"],
    sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y"],
    priceRange: [399, 1299],
  },
  {
    name: "girls",
    subcategories: ["tutu", "tiered", "maxi", "shirt-dress", "sweatshirt", "empire-line"],
    sizes: ["4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y", "9-10Y"],
    priceRange: [499, 2499],
  },
];

// ── Product name parts ───────────────────────────────────────────────────────
const COLORS = ["Pink","Rose","Peach","Lavender","Coral","Red","Blush","Magenta","Ivory","Mint","Lilac","Cream","Mauve","Fuchsia","Powder Blue","Sky Blue","Lemon","Sage","Dusty Pink","Off White"];
const ADJECTIVES = ["Floral","Elegant","Soft","Cute","Stylish","Princess","Charming","Classic","Trendy","Lovely","Dreamy","Delicate","Breezy","Festive","Sparkly","Ruffled","Embroidered","Printed","Smocked","Lace-Trim"];
const FABRICS = ["Cotton","Silk Blend","Organic Cotton","Linen","Chiffon","Velvet","Tulle & Satin","Georgette","Crepe","Jersey Knit"];

// Human-readable subcategory product type labels
const SUBCAT_LABEL = {
  "onesies":     "Onesie",
  "rompers":     "Romper",
  "dresses":     "Dress",
  "layette":     "Layette Set",
  "a-line":      "A-Line Dress",
  "party-frock": "Party Frock",
  "pinafore":    "Pinafore Dress",
  "smocked":     "Smocked Dress",
  "tutu":        "Tutu Dress",
  "tiered":      "Tiered Ruffle Dress",
  "maxi":        "Maxi Dress",
  "shirt-dress": "Shirt Dress",
  "sweatshirt":  "Sweatshirt Dress",
  "empire-line": "Empire Line Dress",
};

const TAGS = {
  infant:  ["newborn","soft","baby","comfortable"],
  toddler: ["toddler","playful","casual","cute"],
  girls:   ["girls","party","festive","stylish"],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function fetchPexels(query, perPage = 80) {
  return new Promise((resolve, reject) => {
    const path = `/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`;
    https.get(
      { hostname: "api.pexels.com", path, headers: { Authorization: PEXELS_KEY } },
      (res) => {
        let data = "";
        res.on("data", c => data += c);
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve((json.photos || []).map(p => p.src.large));
          } catch (e) { reject(e); }
        });
      }
    ).on("error", reject);
  });
}

async function main() {
  console.log("🔍 Fetching per-subcategory images from Pexels...\n");

  // Fetch images per subcategory
  const pool = {};
  for (const [sub, query] of Object.entries(SUBCATEGORY_QUERIES)) {
    const urls = await fetchPexels(query, 40);
    pool[sub] = urls.length ? urls : null;
    console.log(`  ✅ ${sub.padEnd(14)} "${query}" → ${urls.length} photos`);
  }

  console.log("\n🏗  Building 500 products...");

  const products = [];
  // Track index per subcategory so each product gets a different image
  const poolIdx = {};
  Object.keys(pool).forEach(k => poolIdx[k] = 0);

  for (let i = 1; i <= 500; i++) {
    const cat        = pick(CATEGORIES);
    const subcategory = pick(cat.subcategories);
    const fabric     = pick(FABRICS);
    const label      = SUBCAT_LABEL[subcategory] || "Dress";
    const title      = `${pick(COLORS)} ${pick(ADJECTIVES)} ${label}`;

    // Pick next image from this subcategory's pool (cycle)
    const subPool = pool[subcategory];
    const image   = subPool
      ? subPool[poolIdx[subcategory]++ % subPool.length]
      : `https://picsum.photos/seed/ar${i}/400/500`;

    const styleWord = subcategory.replace(/-/g, " ");
    const descTemplates = [
      `Beautiful ${styleWord} crafted from ${fabric.toLowerCase()} — soft and comfortable for your little one.`,
      `This adorable ${styleWord} is made with ${fabric.toLowerCase()}, perfect for everyday wear and special occasions.`,
      `A charming ${styleWord} in premium ${fabric.toLowerCase()} — machine washable and skin-safe.`,
      `Lightweight ${fabric.toLowerCase()} ${styleWord} designed for comfort and style. Your little one will love it.`,
      `Elegant ${styleWord} made from ${fabric.toLowerCase()} — ideal for parties, outings, and everyday adventures.`,
    ];

    const [minP, maxP] = cat.priceRange;
    const price         = randInt(minP, maxP);
    const discount      = randInt(5, 40);
    const originalPrice = Math.round(price / (1 - discount / 100) / 50) * 50;

    products.push({
      id: i,
      title,
      price,
      originalPrice,
      discount,
      rating:      +(Math.random() * 2 + 3).toFixed(1),
      reviewCount: randInt(10, 1200),
      isNew:       Math.random() > 0.7,
      isBestSeller: Math.random() > 0.8,
      category:    cat.name,
      subcategory,
      sizes:       cat.sizes,
      fabric,
      stock:       randInt(5, 50),
      tags:        [...TAGS[cat.name], subcategory],
      description: pick(descTemplates),
      image,          // single real image
      images: [image], // only 1 — UI will fake 4 angles with CSS
    });
  }

  fs.writeFileSync("db.json", JSON.stringify({ products }, null, 2));
  console.log(`\n✅ db.json with ${products.length} products saved!`);
}

main().catch(err => { console.error("❌", err.message); process.exit(1); });

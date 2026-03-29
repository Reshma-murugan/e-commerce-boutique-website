// Central taxonomy — defines categories and their subcategories.
// Subcategory images use local assets from the subCategory folder.

import infantMainImg  from '../assets/mainCategoryImage/infantGirl.jpg';
import toddlerMainImg from '../assets/mainCategoryImage/toddlerGirl.jpg';
import girlsMainImg   from '../assets/mainCategoryImage/girl.jpg';

// Baby subcategory images
import rompersImg     from '../assets/subCategory/Baby/rombersANDbodysuits.jpg';
import onesiesImg     from '../assets/subCategory/Baby/onesies.jpg';
import babySummerImg  from '../assets/subCategory/Baby/summerDress.jpg';
import babyPartyImg   from '../assets/subCategory/Baby/partyANDocation.jpg';
import babyWinterImg  from '../assets/subCategory/Baby/winterWear.jpg';

// Toddler subcategory images
import tCasualImg     from '../assets/subCategory/toddlers/casual.jpg';
import tPartyImg      from '../assets/subCategory/toddlers/party wear.jpg';
import tEthnicImg     from '../assets/subCategory/toddlers/ethnic.jpg';
import tSummerImg     from '../assets/subCategory/toddlers/summer.jpg';
import tWinterImg     from '../assets/subCategory/toddlers/winter.jpg';

// Girls subcategory images
import gCasualImg     from '../assets/subCategory/girls/casual.jpg';
import gPartyImg      from '../assets/subCategory/girls/party.jpg';
import gEthnicImg     from '../assets/subCategory/girls/ethnicORtraditonal.jpg';
import gSummerImg     from '../assets/subCategory/girls/summer.jpg';
import gWinterImg     from '../assets/subCategory/girls/winter.jpg';

export const TAXONOMY = {
  infant: {
    label: 'Infants',
    age: '0 – 24 Months',
    description: 'Soft, gentle styles for your newest arrival. Designed for comfort and easy dressing.',
    image: infantMainImg,
    color: '#fff0f5',
    accent: '#ff4d7d',
    subcategories: [
      {
        slug: 'onesies',
        label: 'Onesies',
        desc: 'Soft all-day comfort basics.',
        image: onesiesImg,
      },
      {
        slug: 'party wear',
        label: 'Party / Occasion Wear',
        desc: 'Special outfits for memorable moments.',
        image: babyPartyImg,
      },
      {
        slug: 'rompers',
        label: 'Rompers & Bodysuits',
        desc: 'Easy snap-on styles for tiny ones.',
        image: rompersImg,
      },
      {
        slug: 'summer',
        label: 'Summer Wear',
        desc: 'Light and breezy warm-weather looks.',
        image: babySummerImg,
      },
      {
        slug: 'winter',
        label: 'Winter Wear',
        desc: 'Cozy layers to keep baby warm.',
        image: babyWinterImg,
      },
    ],
  },
  toddler: {
    label: 'Toddlers',
    age: '2 – 5 Years',
    description: 'Playful and durable outfits built for little explorers on the move.',
    image: toddlerMainImg,
    color: '#fff5f0',
    accent: '#ff7043',
    subcategories: [
      {
        slug: 'casual wear',
        label: 'Casual Wear',
        desc: 'Comfortable outfits for school and play.',
        image: tCasualImg,
      },
      {
        slug: 'ethnic',
        label: 'Ethnic / Traditional Wear',
        desc: 'Traditional styles for celebrations.',
        image: tEthnicImg,
      },
      {
        slug: 'party_wear',
        label: 'Party Wear',
        desc: 'Tulle, sparkle, and everything fun.',
        image: tPartyImg,
      },
      {
        slug: 'summer',
        label: 'Summer Wear',
        desc: 'Breezy styles for warm days.',
        image: tSummerImg,
      },
      {
        slug: 'winter',
        label: 'Winter Wear',
        desc: 'Warm and cosy outfits for cooler days.',
        image: tWinterImg,
      },
    ],
  },
  girls: {
    label: 'Girls',
    age: '6 – 14 Years',
    description: 'Trendy, expressive fashion for girls who know exactly what they want.',
    image: girlsMainImg,
    color: '#f5f0ff',
    accent: '#9c27b0',
    subcategories: [
      {
        slug: 'casual wear',
        label: 'Casual Wear',
        desc: 'Everyday styles that are effortlessly cool.',
        image: gCasualImg,
      },
      {
        slug: 'ethnic',
        label: 'Ethnic / Traditional Wear',
        desc: 'Elegant traditional outfits for festivals.',
        image: gEthnicImg,
      },
      {
        slug: 'party wear',
        label: 'Party Wear',
        desc: 'Stunning looks for special occasions.',
        image: gPartyImg,
      },
      {
        slug: 'summer',
        label: 'Summer Wear',
        desc: 'Light and trendy warm-weather fashion.',
        image: gSummerImg,
      },
      {
        slug: 'winter',
        label: 'Winter Wear',
        desc: 'Cosy and stylish cold-weather outfits.',
        image: gWinterImg,
      },
    ],
  },
};

export const getCategoryMeta = (slug) => TAXONOMY[slug] || null;
export const getSubcategoryMeta = (catSlug, subSlug) =>
  TAXONOMY[catSlug]?.subcategories.find(s => s.slug === subSlug) || null;

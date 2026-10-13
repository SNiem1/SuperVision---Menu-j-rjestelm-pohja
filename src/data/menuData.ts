import { MenuItem, Category, Allergen } from '../types';
import { restaurantConfig } from '../config/restaurant';
import raspberrySorbetImg from '../assets/images/raspberry_sorbet_1788416139559.jpg';
import whiteWineImg from '../assets/images/white_wine_1788783729708.jpg';

export const CATEGORIES: Category[] = restaurantConfig.categories;

export const ALLERGENS: Record<string, Allergen> = {
  // --- FREE-FROM SPECIAL DIETS ---
  G: {
    key: 'G',
    kind: 'free-from',
    name: { fi: 'Gluteeniton', en: 'Gluten-free' },
    description: { fi: 'Valmistettu ilman gluteenipitoisia viljoja.', en: 'Prepared without gluten-containing grains.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  L: {
    key: 'L',
    kind: 'free-from',
    name: { fi: 'Laktoositon', en: 'Lactose-free' },
    description: { fi: 'Valmistettu ilman laktoosia.', en: 'Prepared without lactose.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  VL: {
    key: 'VL',
    kind: 'free-from',
    name: { fi: 'Vähälaktoosinen', en: 'Low lactose' },
    description: { fi: 'Sisältää vain pienen määrän laktoosia.', en: 'Contains very low lactose content.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  M: {
    key: 'M',
    kind: 'free-from',
    name: { fi: 'Maidoton', en: 'Dairy-free' },
    description: { fi: 'Valmistettu täysin ilman maitotuotteita.', en: 'Prepared completely without dairy products.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  Vegan: {
    key: 'Vegan',
    kind: 'free-from',
    name: { fi: 'Vegaaninen', en: 'Vegan' },
    description: { fi: '100 % kasvipohjainen, ei eläinperäisiä ainesosia.', en: '100% plant-based, no animal ingredients.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  KASV: {
    key: 'KASV',
    kind: 'free-from',
    name: { fi: 'Kasvisruoka', en: 'Vegetarian' },
    description: { fi: 'Ei sisällä lihaa tai kalaa (lakto-ovo-kasvisruoka).', en: 'Contains no meat or fish (lacto-ovo vegetarian).' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  P: {
    key: 'P',
    kind: 'free-from',
    name: { fi: 'Pähkinätön', en: 'Nut-free' },
    description: { fi: 'Ei sisällä pähkinöitä tai maapähkinöitä.', en: 'Prepared without tree nuts or peanuts.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  KAN: {
    key: 'KAN',
    kind: 'free-from',
    name: { fi: 'Kananmunaton', en: 'Egg-free' },
    description: { fi: 'Ei sisällä kananmunaa.', en: 'Prepared without eggs.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  SOY_FREE: {
    key: 'SOY_FREE',
    kind: 'free-from',
    name: { fi: 'Soijaton', en: 'Soy-free' },
    description: { fi: 'Valmistettu ilman soijaa tai soijajohdannaisia.', en: 'Prepared without soy or soy derivatives.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  KAL_FREE: {
    key: 'KAL_FREE',
    kind: 'free-from',
    name: { fi: 'Kalaton', en: 'Fish-free' },
    description: { fi: 'Ei sisällä kalaa tai kalatuotteita.', en: 'Contains no fish or fish products.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  AYR_FREE: {
    key: 'AYR_FREE',
    kind: 'free-from',
    name: { fi: 'Äyriäistön', en: 'Shellfish-free' },
    description: { fi: 'Ei sisällä äyriäisiä tai nilviäisiä.', en: 'Contains no shellfish or crustaceans.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  VALK_FREE: {
    key: 'VALK_FREE',
    kind: 'free-from',
    name: { fi: 'Valkosipuliton', en: 'Garlic-free' },
    description: { fi: 'Valmistettu ilman valkosipulia.', en: 'Prepared without garlic.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  SIK_FREE: {
    key: 'SIK_FREE',
    kind: 'free-from',
    name: { fi: 'Sianlihaton', en: 'Pork-free' },
    description: { fi: 'Ei sisällä sianlihaa tai porsastuotteita.', en: 'Contains no pork or pork-derived ingredients.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  KETO: {
    key: 'KETO',
    kind: 'free-from',
    name: { fi: 'Keto-ystävällinen', en: 'Keto friendly' },
    description: { fi: 'Vähähiilihydraattinen annos.', en: 'Low-carb ketogenic option.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  FODMAP: {
    key: 'FODMAP',
    kind: 'free-from',
    name: { fi: 'Low FODMAP', en: 'Low FODMAP' },
    description: { fi: 'Sopii herkkävatsaisille FODMAP-ruokavaliota noudattaville.', en: 'Suitable for a low-FODMAP diet.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },
  SOKERITON: {
    key: 'SOKERITON',
    kind: 'free-from',
    name: { fi: 'Sokeriton', en: 'No added sugar' },
    description: { fi: 'Ei lisättyä valkoista sokeria.', en: 'Contains no added refined sugars.' },
    bgClass: 'bg-[#f1f5f2] text-[#1b4332] border-[#2d6a4f]/25',
    textClass: 'text-[#1b4332]',
  },

  // --- CONTAINS ALLERGENS ---
  Gluten: {
    key: 'Gluten',
    kind: 'contains',
    name: { fi: 'Gluteeni', en: 'Gluten' },
    partitiveName: { fi: 'gluteenia', en: 'gluten' },
    description: { fi: 'Sisältää gluteenipitoista viljaa (vehnä, ohra, ruis).', en: 'Contains gluten grains (wheat, barley, rye).' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Dairy: {
    key: 'Dairy',
    kind: 'contains',
    name: { fi: 'Maitotuotteet', en: 'Dairy' },
    partitiveName: { fi: 'maitotuotteita', en: 'dairy' },
    description: { fi: 'Sisältää maitoa tai maitoproteiinia.', en: 'Contains milk or dairy protein.' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Soy: {
    key: 'Soy',
    kind: 'contains',
    name: { fi: 'Soija', en: 'Soy' },
    partitiveName: { fi: 'soijaa', en: 'soy' },
    description: { fi: 'Sisältää soijaa tai soijasta valmistettuja ainesosia.', en: 'Contains soy or soy-derived ingredients.' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Eggs: {
    key: 'Eggs',
    kind: 'contains',
    name: { fi: 'Kananmuna', en: 'Eggs' },
    partitiveName: { fi: 'kananmunaa', en: 'eggs' },
    description: { fi: 'Sisältää kananmunaa tai kananmunatuotteita.', en: 'Contains eggs or egg-derived products.' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Fish: {
    key: 'Fish',
    kind: 'contains',
    name: { fi: 'Kala', en: 'Fish' },
    partitiveName: { fi: 'kalaa', en: 'fish' },
    description: { fi: 'Sisältää kalaa tai kalaperäisiä ainesosia.', en: 'Contains fish or fish-derived ingredients.' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Shellfish: {
    key: 'Shellfish',
    kind: 'contains',
    name: { fi: 'Äyriäiset', en: 'Shellfish' },
    partitiveName: { fi: 'äyriäisiä', en: 'shellfish' },
    description: { fi: 'Sisältää äyriäisiä tai nilviäisiä (kuten katkarapuja).', en: 'Contains shellfish or crustaceans (such as shrimp).' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Nuts: {
    key: 'Nuts',
    kind: 'contains',
    name: { fi: 'Pähkinät', en: 'Tree nuts' },
    partitiveName: { fi: 'pähkinöitä', en: 'nuts' },
    description: { fi: 'Sisältää pähkinöitä tai manteleita.', en: 'Contains tree nuts or almonds.' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Pork: {
    key: 'Pork',
    kind: 'contains',
    name: { fi: 'Sianliha', en: 'Pork' },
    partitiveName: { fi: 'sianlihaa', en: 'pork' },
    description: { fi: 'Sisältää sianlihaa tai pekonivalmisteita.', en: 'Contains pork or bacon ingredients.' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },
  Garlic: {
    key: 'Garlic',
    kind: 'contains',
    name: { fi: 'Valkosipuli', en: 'Garlic' },
    partitiveName: { fi: 'valkosipulia', en: 'garlic' },
    description: { fi: 'Sisältää valkosipulia.', en: 'Contains garlic.' },
    bgClass: 'bg-[#faf4ed] text-[#78350f] border-[#b45309]/25',
    textClass: 'text-[#78350f]',
  },

  // --- ORIGIN & CERTIFICATIONS ---
  FI: {
    key: 'FI',
    kind: 'origin',
    name: { fi: 'Kotimaiset raaka-aineet', en: 'Local ingredients' },
    description: { fi: 'Pääraaka-aineet ovat kotimaista alkuperää.', en: 'Primary ingredients are of domestic local origin.' },
    bgClass: 'bg-[#f2f4f8] text-brand-blue border-brand-gold/30',
    textClass: 'text-brand-blue',
    iconSymbol: '🇫🇮',
  },
  Organic: {
    key: 'Organic',
    kind: 'origin',
    name: { fi: 'Luomu', en: 'Organic' },
    description: { fi: 'Valmistettu sertifioiduista luomuraaka-aineista.', en: 'Made with certified organic ingredients.' },
    bgClass: 'bg-[#fdf9ef] text-[#854d0e] border-brand-gold/40',
    textClass: 'text-[#854d0e]',
    iconSymbol: '🌿',
  },
};

export const MENU_ITEMS: MenuItem[] = [
  // ==================== ALKURUOAT (APPETIZERS) ====================
  {
    id: 'vihrea-alkusalaatti',
    category: 'alkuruoat',
    name: { fi: 'Vihreä alkusalaatti', en: 'House Green Salad' },
    description: {
      fi: 'Raikasta vihersalaattia, kurkkua, kirsikkatomaattia, pikkelöityä punasipulia ja talon sitrusvinaigrettea.',
      en: 'Fresh mixed greens, cucumber, cherry tomatoes, pickled red onion, and house citrus vinaigrette.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'VALK_FREE', 'Organic'],
    price: 6.50,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'valkosipulileivat',
    category: 'alkuruoat',
    name: { fi: 'Rapeat valkosipulileivät', en: 'Crispy Garlic Bread' },
    description: {
      fi: 'Paahdettua leipää runsaalla yrtti-valkosipulivoilla ja parmesaanijuustolla.',
      en: 'Toasted bread loaded with aromatic herb-garlic butter and shaved parmesan.',
    },
    allergens: ['L', 'KASV', 'P', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Garlic', 'Gluten'],
    price: 7.20,
    imageUrl: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'mozzarellatikut',
    category: 'alkuruoat',
    name: { fi: 'Mozzarellatikut & dippi', en: 'Mozzarella Sticks with Dip' },
    description: {
      fi: 'Kullanruskeiksi paistetut rapeat mozzarellatikut, tarjoillaan mausteisen tomaattisalsan ja majoneesin kera.',
      en: 'Golden-fried crispy mozzarella sticks served with spiced tomato salsa and house mayonnaise dip.',
    },
    allergens: ['KASV', 'P', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Eggs', 'Gluten', 'Dairy'],
    price: 8.50,
    imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'toast-skagen',
    category: 'alkuruoat',
    name: { fi: 'Klassinen Toast Skagen', en: 'Classic Toast Skagen' },
    description: {
      fi: 'Käsin kuorittuja katkarapuja tillimajoneesissa, kirjolohenmätiä, sitruunaa ja paahdettua leipää.',
      en: 'Hand-peeled shrimp in dill mayonnaise, trout roe, fresh lemon, and golden toasted brioche.',
    },
    allergens: ['L', 'M', 'P', 'SOY_FREE', 'SIK_FREE', 'Shellfish', 'Eggs', 'Fish', 'Gluten'],
    price: 13.50,
    imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800&auto=format&fit=crop&q=80',
  },

  // ==================== SALAATIT (SALADS) ====================
  {
    id: 'kanasalaatti',
    category: 'salaatit',
    name: { fi: 'Grillattu Kanasalaatti', en: 'Grilled Chicken Salad' },
    description: {
      fi: 'Mehukasta pariloitua kananrintaa, rapeaa salaattia, kurkkua, kirsikkatomaattia, avokadoa ja kevyt yrttikastike.',
      en: 'Juicy grilled chicken breast, crisp greens, cucumber, cherry tomatoes, sliced avocado, and light herb dressing.',
    },
    allergens: ['G', 'L', 'M', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'KETO', 'FI'],
    price: 15.50,
    priceOptions: [
      { label: { fi: 'Normaali', en: 'Regular' }, value: 15.50 },
      { label: { fi: 'Iso annos', en: 'Large' }, value: 19.50 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'vuohenjuustosalaatti',
    category: 'salaatit',
    name: { fi: 'Lämmin Vuohenjuustosalaatti', en: 'Warm Goat Cheese Salad' },
    description: {
      fi: 'Paahdettua vuohenjuustoa, vihersalaattia, marinoitua punajuurta, saksanpähkinöitä ja balsamicosiirappia.',
      en: 'Seared warm goat cheese, mixed greens, marinated beetroot, walnuts, and rich balsamic glaze.',
    },
    allergens: ['G', 'L', 'VL', 'KASV', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Nuts', 'Dairy'],
    price: 16.00,
    priceOptions: [
      { label: { fi: 'Normaali', en: 'Regular' }, value: 16.00 },
      { label: { fi: 'Iso annos', en: 'Large' }, value: 20.00 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'kreikkalainen-salaatti',
    category: 'salaatit',
    name: { fi: 'Kreikkalainen salaatti', en: 'Greek Salad' },
    description: {
      fi: 'Aitoa fetajuustoa, kypsiä tomaatteja, kurkkua, punasipulia, kalamata-oliiveja ja neitsytoliiviöljyä.',
      en: 'Authentic feta cheese, vine tomatoes, crisp cucumber, red onions, Kalamata olives, and extra virgin olive oil.',
    },
    allergens: ['G', 'L', 'VL', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'KETO', 'Dairy'],
    price: 14.50,
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tofusalaatti',
    category: 'salaatit',
    name: { fi: 'Rapea Tofusalaatti', en: 'Crispy Tofu Salad' },
    description: {
      fi: 'Paistettua maustettua tofua, edamame-papuja, porkkanaa, retiisiä, sesaminsiemeniä ja inkiväärikastiketta.',
      en: 'Pan-fried seasoned tofu, edamame beans, carrot ribbons, radishes, sesame seeds, and ginger-soy dressing.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Soy', 'Organic'],
    price: 15.00,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  },

  // ==================== KEITOT (SOUPS) ====================
  {
    id: 'kermainen-lohikeitto',
    category: 'keitot',
    name: { fi: 'Kermainen lohikeitto', en: 'Creamy Salmon Soup' },
    description: {
      fi: 'Perinteinen täyteläinen keitto lohifileestä, perunasta, porkkanasta, purjosta ja runsaasta tuoreesta tillistä. Tarjoillaan ruisleivän ja voin kera.',
      en: 'Traditional velvety soup with tender salmon chunks, potatoes, carrots, leek, and fresh dill. Served with rye bread and butter.',
    },
    allergens: ['G', 'L', 'P', 'KAN', 'SOY_FREE', 'AYR_FREE', 'SIK_FREE', 'FI', 'Fish', 'Dairy'],
    price: 15.90,
    priceOptions: [
      { label: { fi: 'Pieni', en: 'Small' }, value: 12.50 },
      { label: { fi: 'Iso', en: 'Large' }, value: 15.90 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tomaatti-basilikakeitto',
    category: 'keitot',
    name: { fi: 'Tomaatti-basilikakeitto', en: 'Tomato Basil Soup' },
    description: {
      fi: 'Pehmeä paahdetuista tomaateista valmistettu keitto tuoreella basilikalla ja yrttiöljyllä. Tarjoillaan leivän kera.',
      en: 'Smooth roasted tomato soup with fresh basil, olive oil swirl, and warm artisan bread.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'VALK_FREE'],
    price: 11.50,
    priceOptions: [
      { label: { fi: 'Pieni', en: 'Small' }, value: 9.50 },
      { label: { fi: 'Iso', en: 'Large' }, value: 11.50 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sienikeitto',
    category: 'keitot',
    name: { fi: 'Kermainen metsäsienikeitto', en: 'Creamy Forest Mushroom Soup' },
    description: {
      fi: 'Maukas ja samettinen keitto metsäsienistä, maustettuna tuoreella timjamilla ja lorauksella kermaa.',
      en: 'Rich and velvety wild forest mushroom soup seasoned with fresh thyme and a touch of cream.',
    },
    allergens: ['G', 'L', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Dairy'],
    price: 13.00,
    priceOptions: [
      { label: { fi: 'Pieni', en: 'Small' }, value: 10.50 },
      { label: { fi: 'Iso', en: 'Large' }, value: 13.00 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80',
  },

  // ==================== PÄÄRUOAT (MAINS) ====================
  {
    id: 'pariloitu-naudanpihvi',
    category: 'paaruoat',
    name: { fi: 'Pariloitu Naudan Ulkofileepihvi (200g)', en: 'Grilled Beef Sirloin Steak (200g)' },
    description: {
      fi: 'Murea naudan ulkofileepihvi, maustevoita, paahdettuja kauden kasviksia ja rapeita maalaisranskalaisia.',
      en: 'Tender beef sirloin steak served with herb butter, roasted seasonal vegetables, and crispy rustic French fries.',
    },
    allergens: ['G', 'L', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'KETO', 'FI'],
    price: 28.50,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'paistettu-lohi',
    category: 'paaruoat',
    name: { fi: 'Paistettu Lohifilee & Yrttiperunat', en: 'Pan-Seared Salmon Fillet' },
    description: {
      fi: 'Voissa paistettu lohifilee, sitruuna-hollandaiskastiketta, höyrytettyä parsaa ja tilliperunoita.',
      en: 'Pan-seared fresh salmon fillet with lemon hollandaise sauce, steamed asparagus, and dill potatoes.',
    },
    allergens: ['G', 'L', 'P', 'SOY_FREE', 'AYR_FREE', 'SIK_FREE', 'KETO', 'Fish', 'Eggs', 'Dairy'],
    price: 24.90,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'grillattu-kana',
    category: 'paaruoat',
    name: { fi: 'Grillattu Kananrinta & Punaviinikastike', en: 'Grilled Chicken Breast' },
    description: {
      fi: 'Mureaksi pariloitua kananrintaa, täyteläistä tummaa punaviinikastiketta, bataattipyreetä ja papuja.',
      en: 'Succulent grilled chicken breast with rich red wine reduction, sweet potato purée, and buttered green beans.',
    },
    allergens: ['G', 'L', 'M', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'FI'],
    price: 21.50,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'lihapullat-muusi',
    category: 'paaruoat',
    name: { fi: 'Klassiset Lihapullat & Perunamuusi', en: 'Classic Meatballs & Mashed Potatoes' },
    description: {
      fi: 'Talon mehevät lihapullat kermaisessa kermakastikkeessa, kuohkeaa voilla aateloitua perunamuusia, puolukkahilloa ja suolakurkkuja.',
      en: 'Tender homemade meatballs in creamy savory gravy, fluffy buttery mashed potatoes, lingonberry jam, and pickled cucumbers.',
    },
    allergens: ['G', 'L', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'FI', 'Eggs', 'Dairy'],
    price: 18.90,
    imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'wieninleike',
    category: 'paaruoat',
    name: { fi: 'Wieninleike & Ranskalaiset', en: 'Wiener Schnitzel with Fries' },
    description: {
      fi: 'Rapeaksi leivitetty porsaanleike, sitruunaviipale, kaprista, anjovista ja rapeita ranskanperunoita.',
      en: 'Crispy breaded pork escalope served with lemon wedge, capers, anchovy fillet, and French fries.',
    },
    allergens: ['L', 'M', 'P', 'SOY_FREE', 'AYR_FREE', 'Eggs', 'Gluten', 'Pork', 'Fish'],
    price: 22.00,
    imageUrl: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&auto=format&fit=crop&q=80',
  },

  // ==================== PASTAT & KASVIS (PASTA & VEGETARIAN) ====================
  {
    id: 'pasta-bolognese',
    category: 'pastat',
    name: { fi: 'Pasta Bolognese', en: 'Pasta Bolognese' },
    description: {
      fi: 'Hitaasti haudutettu perinteinen naudan jauheliha-tomaattikastike tagliatelle-pastalla ja raastetulla parmesaanilla.',
      en: 'Slow-simmered rich beef and tomato ragù served with tagliatelle pasta and fresh grated parmesan.',
    },
    allergens: ['L', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'FI', 'Gluten', 'Dairy'],
    price: 16.50,
    imageUrl: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'pasta-carbonara',
    category: 'pastat',
    name: { fi: 'Klassinen Pasta Carbonara', en: 'Classic Pasta Carbonara' },
    description: {
      fi: 'Spagettia, rapeaa pekonia, kananmunankeltuaista, pecorino- ja parmesaanijuustoa sekä vastajauhettua mustapippuria.',
      en: 'Spaghetti tossed with crispy smoked pancetta, egg yolk, pecorino, parmesan, and cracked black pepper.',
    },
    allergens: ['L', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'Eggs', 'Gluten', 'Pork', 'Dairy'],
    price: 17.50,
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tomaatti-basilika-pasta',
    category: 'pastat',
    name: { fi: 'Tomaatti-basilikapasta', en: 'Tomato Basil Penne' },
    description: {
      fi: 'Penne-pastaa, makeaa kirsikkatomaattikastiketta, valkosipulia, tuoretta basilikaa ja paahdettuja pinjansiemeniä.',
      en: 'Penne pasta tossed in sweet cherry tomato sauce, garlic, fragrant fresh basil, and toasted pine nuts.',
    },
    allergens: ['L', 'M', 'Vegan', 'KASV', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Organic', 'Gluten'],
    price: 15.00,
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'kasviswokki',
    category: 'pastat',
    name: { fi: 'Kasvis-Tofuwokki & Riisi', en: 'Vegetable & Tofu Stir-Fry' },
    description: {
      fi: 'Värikkäitä wokattuja tuoreita kasviksia, paistettua tofua, seesami-soijakastiketta ja jasmiiniriisiä.',
      en: 'Colorful wok-tossed garden vegetables, crispy seasoned tofu, savory sesame-soy glaze, and steamed jasmine rice.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Organic', 'Soy'],
    price: 16.00,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
  },

  // ==================== HAMPURILAISET & LEIVÄT ====================
  {
    id: 'talon-juustohampurilainen',
    category: 'burgerit',
    name: { fi: 'Talon Juustohampurilainen & Ranskalaiset', en: 'House Cheeseburger & Fries' },
    description: {
      fi: '180g kotimainen naudanjauhelihapihvi, cheddaria, rapeaa pekonia, salaattia, tomaattia, suolakurkkua, talon hampurilaismajoneesia ja rapeita ranskalaisia.',
      en: '180g domestic beef patty, melted cheddar, crispy bacon, lettuce, tomato, pickles, house burger sauce, and golden fries.',
    },
    allergens: ['L', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'FI', 'Eggs', 'Gluten', 'Pork', 'Dairy'],
    price: 18.50,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'kanahampurilainen',
    category: 'burgerit',
    name: { fi: 'Rapea Kanahampurilainen', en: 'Crispy Chicken Burger' },
    description: {
      fi: 'Kullanruskeaksi leivitetty mehevä kanapihvi, coleslaw-salaattia, maustekurkkua, mietoa chilimajoneesia ja ranskalaisia.',
      en: 'Crispy golden fried chicken breast, tangy coleslaw, pickles, mild chili mayo, and French fries.',
    },
    allergens: ['L', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'FI', 'Eggs', 'Gluten'],
    price: 17.90,
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'kasvishampurilainen',
    category: 'burgerit',
    name: { fi: 'Vegaaninen Kasvishampurilainen', en: 'Vegan Veggie Burger' },
    description: {
      fi: 'Maukas kasvipohjainen pihvi, vegaanista juustoa, avokadoa, salaattia, tomaattia, valkosipuliveganeesia ja bataattiranskalaisia.',
      en: 'Savory plant-based patty, vegan cheese, avocado, fresh greens, tomato, garlic vegan mayo, and sweet potato fries.',
    },
    allergens: ['L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Soy', 'Gluten'],
    price: 17.50,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'klubi-sandwich',
    category: 'burgerit',
    name: { fi: 'Klassinen Club Sandwich', en: 'Classic Club Sandwich' },
    description: {
      fi: 'Kolmikerroksinen paahdettu leipä kananrinnalla, pekonilla, kananmunalla, salaatilla, tomaatilla ja majoneesilla. Tarjoillaan ranskalaisten kera.',
      en: 'Triple-decker toasted sandwich with roasted chicken, bacon, boiled egg, lettuce, tomato, and mayo. Served with fries.',
    },
    allergens: ['L', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'Eggs', 'Gluten', 'Pork'],
    price: 16.90,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
  },

  // ==================== JÄLKIRUOAT (DESSERTS) ====================
  {
    id: 'perinteiset-letut',
    category: 'jalkiruoat',
    name: { fi: 'Perinteiset Letut', en: 'Traditional Pancakes (Crêpes)' },
    description: {
      fi: 'Vastapaistetut ohuet perinteiset letut, tarjoillaan makean mansikkahillon ja aidon vaniljajäätelön tai kermavaahdon kera.',
      en: 'Freshly prepared traditional thin golden crêpe pancakes, served with sweet strawberry jam and vanilla ice cream or whipped cream.',
    },
    allergens: ['L', 'KASV', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Eggs', 'Gluten', 'Dairy'],
    price: 8.90,
    priceOptions: [
      { label: { fi: '2 kpl letut', en: '2 crêpes' }, value: 8.90 },
      { label: { fi: '4 kpl iso annos', en: '4 crêpes large' }, value: 12.90 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80',
    arModelUsdzUrl: 'https://pub-0bdbdcb354364bf7abeb4232843a203f.r2.dev/pancakes_photogrammetry.usdz',
  },
  {
    id: 'suklaakakku',
    category: 'jalkiruoat',
    name: { fi: 'Lämmin Suklaakakku (Fondant)', en: 'Warm Chocolate Lava Cake' },
    description: {
      fi: 'Suussasulava lämmin suklaakakku juoksevalla sydämellä, vaniljajäätelöä ja tuoreita vadelmia.',
      en: 'Decadent warm chocolate fondant with molten center, served with vanilla ice cream and fresh raspberries.',
    },
    allergens: ['L', 'KASV', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Eggs', 'Gluten', 'Dairy'],
    price: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'omenapiirakka',
    category: 'jalkiruoat',
    name: { fi: 'Omenapiirakka & Vaniljakastike', en: 'Apple Pie with Vanilla Custard' },
    description: {
      fi: 'Kanelilla ja fariinisokerilla maustettua lämmintä omenapiirakkaa samettisen vaniljakastikkeen kera.',
      en: 'Warm cinnamon-spiced apple pie served with velvety vanilla bean custard sauce.',
    },
    allergens: ['L', 'KASV', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Gluten', 'Dairy'],
    price: 8.50,
    imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'jaateloannos',
    category: 'jalkiruoat',
    name: { fi: 'Talon Jäätelöannos', en: 'House Ice Cream Sundae' },
    description: {
      fi: 'Kolme palloa kermajäätelöä (vanilja, suklaa ja mansikka), suklaakastiketta, kermavaahtoa ja vohvelitikku.',
      en: 'Three scoops of premium ice cream (vanilla, chocolate, strawberry), chocolate drizzle, whipped cream, and wafer.',
    },
    allergens: ['G', 'L', 'KASV', 'P', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Dairy'],
    price: 7.90,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'marjasorbetti',
    category: 'jalkiruoat',
    name: { fi: 'Raikas Vadelmasorbetti', en: 'Fresh Raspberry Sorbet' },
    description: {
      fi: '100% maidoton ja raikas vadelmasorbetti, koristeltu mintulla ja tuoreilla marjoilla.',
      en: 'Refreshing 100% dairy-free raspberry sorbet garnished with fresh mint sprig and seasonal berries.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Organic'],
    price: 7.50,
    imageUrl: raspberrySorbetImg,
  },

  // ==================== JUOMAT (BEVERAGES) ====================
  {
    id: 'virvoitusjuomat',
    category: 'juomat',
    name: { fi: 'Virvoitusjuomat (0,5 l)', en: 'Soft Drinks (0.5 l)' },
    description: {
      fi: 'Coca-Cola, Coca-Cola Zero, Fanta, Sprite tai kivennäisvesi.',
      en: 'Coca-Cola, Coca-Cola Zero, Fanta, Sprite, or Sparkling Mineral Water.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'VALK_FREE'],
    price: 4.20,
    priceOptions: [
      { label: { fi: '0,33 l', en: '0.33 l' }, value: 3.50 },
      { label: { fi: '0,5 l', en: '0.5 l' }, value: 4.20 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tuoremehu',
    category: 'juomat',
    name: { fi: 'Tuorepuristettu Appelsiinimehu', en: 'Freshly Squeezed Orange Juice' },
    description: {
      fi: '100 % tuorepuristettua appelsiinimehua ilman lisättyä sokeria.',
      en: '100% freshly squeezed orange juice with no added sugar.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'VALK_FREE', 'SOKERITON', 'Organic'],
    price: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'kahvi-tee',
    category: 'juomat',
    name: { fi: 'Luomukahvi tai Haudutettu Tee', en: 'Organic Coffee or Brewed Tea' },
    description: {
      fi: 'Vastajauhettu tummapaahtoinen luomukahvi tai valikoima haudutettuja teelaatuja.',
      en: 'Freshly brewed dark roast organic coffee or selection of premium loose-leaf teas.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'VALK_FREE', 'SOKERITON', 'Organic'],
    price: 3.80,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  },

  // ==================== VIINIT (WINES) ====================
  {
    id: 'talon-punaviini',
    category: 'viinit',
    name: { fi: 'Talon Punaviini (Cabernet Sauvignon / Merlot)', en: 'House Red Wine' },
    description: {
      fi: 'Täyteläinen, kypsän marjainen, miellyttävän tanniininen ja pehmeä punaviini.',
      en: 'Full-bodied, ripe berry notes, soft balanced tannins and smooth finish.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE'],
    price: 38.00,
    priceOptions: [
      { label: { fi: '12 cl', en: '12 cl' }, value: 7.50 },
      { label: { fi: '16 cl', en: '16 cl' }, value: 9.80 },
      { label: { fi: '24 cl', en: '24 cl' }, value: 14.20 },
      { label: { fi: 'Pullo (75 cl)', en: 'Bottle (75 cl)' }, value: 38.00 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'talon-valkoviini',
    category: 'viinit',
    name: { fi: 'Talon Valkoviini (Sauvignon Blanc / Pinot Grigio)', en: 'House White Wine' },
    description: {
      fi: 'Kuiva, raikkaan hapokas, sitruksinen ja tyylikkään mineraalinen valkoviini.',
      en: 'Dry, crisp acidity, vibrant citrus notes and elegant mineral finish.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE'],
    price: 38.00,
    priceOptions: [
      { label: { fi: '12 cl', en: '12 cl' }, value: 7.50 },
      { label: { fi: '16 cl', en: '16 cl' }, value: 9.80 },
      { label: { fi: '24 cl', en: '24 cl' }, value: 14.20 },
      { label: { fi: 'Pullo (75 cl)', en: 'Bottle (75 cl)' }, value: 38.00 },
    ],
    imageUrl: whiteWineImg,
  },
  {
    id: 'prosecco-kuohu',
    category: 'viinit',
    name: { fi: 'Talon Prosecco Brut', en: 'House Prosecco Brut' },
    description: {
      fi: 'Erittäin kuiva, eloisan hedelmäinen, viheromenainen ja raikkaan kupliva.',
      en: 'Extra dry, lively fruitiness, crisp green apple notes and fine refreshing bubbles.',
    },
    allergens: ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN', 'SOY_FREE', 'KAL_FREE', 'AYR_FREE', 'SIK_FREE', 'Organic'],
    price: 42.00,
    priceOptions: [
      { label: { fi: '12 cl lasi', en: '12 cl glass' }, value: 8.50 },
      { label: { fi: 'Pullo (75 cl)', en: 'Bottle (75 cl)' }, value: 42.00 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=800&auto=format&fit=crop&q=80',
  },
];

// PRE-SEEDED REVIEWS FOR GENERIC DISHES
export const PRE_SEEDED_REVIEWS: Record<string, { rating: number; author: string; comment: Record<'fi' | 'en', string> }[]> = {
  'perinteiset-letut': [
    {
      rating: 5,
      author: 'Laura M.',
      comment: {
        fi: 'Aivan ihanat perinteiset letut! Mansikkahillon ja jäätelön kanssa täydellinen jälkiruoka.',
        en: 'Absolutely wonderful traditional crêpes! The strawberry jam and ice cream make a perfect dessert.',
      },
    },
    {
      rating: 5,
      author: 'Daniel K.',
      comment: {
        fi: 'Rapeat reunat ja pehmeä maku. Lapset ja aikuiset rakastivat.',
        en: 'Crispy edges and delicious soft texture. Both kids and adults loved them.',
      },
    },
  ],
  'pariloitu-naudanpihvi': [
    {
      rating: 5,
      author: 'Mikko T.',
      comment: {
        fi: 'Pihvi oli paistettu juuri toiveen mukaisesti mediumiksi. Ranskalaiset olivat erittäin rapeita!',
        en: 'Steak was cooked perfectly to medium as requested. Fries were extremely crispy!',
      },
    },
    {
      rating: 4,
      author: 'Sarah J.',
      comment: {
        fi: 'Erittäin maukas ja murea liha. Maustevoi kruunasi annoksen.',
        en: 'Very flavorful and tender beef. The herb butter crowned the dish nicely.',
      },
    },
  ],
  'kermainen-lohikeitto': [
    {
      rating: 5,
      author: 'Jari H.',
      comment: {
        fi: 'Täyteläinen ja kermainen lohikeitto, lohta oli runsaasti ja maut kohdallaan.',
        en: 'Rich and creamy salmon soup, generous amount of fresh fish and great flavor.',
      },
    },
    {
      rating: 5,
      author: 'Emma W.',
      comment: {
        fi: 'Paras lohikeitto pitkään aikaan. Lämmin ruisleipä oli ihana lisä.',
        en: 'Best salmon soup in a long time. The warm rye bread was a lovely touch.',
      },
    },
  ],
  'talon-juustohampurilainen': [
    {
      rating: 5,
      author: 'Antti V.',
      comment: {
        fi: 'Mehukas pihvi ja hyvä kastike. Yksi parhaista burgereista!',
        en: 'Juicy patty and great sauce. One of the best burgers around!',
      },
    },
  ],
  'kanasalaatti': [
    {
      rating: 4,
      author: 'Sanna P.',
      comment: {
        fi: 'Raikas ja täyttävä salaatti. Kana oli mureaa ja avokado tuoretta.',
        en: 'Fresh and filling salad. Chicken was tender and avocado was perfectly ripe.',
      },
    },
  ],
  'suklaakakku': [
    {
      rating: 5,
      author: 'Henriikka S.',
      comment: {
        fi: 'Suklaakakun sydän oli ihanan valuva. Täydellinen makeanhimon sammuttaja!',
        en: 'The chocolate lava cake had a delightfully gooey center. Pure bliss!',
      },
    },
  ],
};

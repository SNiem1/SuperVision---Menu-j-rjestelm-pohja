import { DishCustomization, DishCustomizationSelection, MenuItem, OrderItemCustomizationSummary, Translation } from '../types';

export const DEFAULT_DISH_CUSTOMIZATIONS: Record<string, DishCustomization> = {
  // ==================== BURGERIT & LEIVÄT ====================
  'talon-juustohampurilainen': {
    canCustomize: true,
    removals: [
      { id: 'sipuli', name: { fi: 'Punasipuli', en: 'Red onion' } },
      { id: 'suolakurkku', name: { fi: 'Suolakurkku', en: 'Pickles' } },
      { id: 'pekoni', name: { fi: 'Rapea pekoni', en: 'Crispy bacon' } },
      { id: 'cheddar', name: { fi: 'Cheddarjuusto', en: 'Cheddar cheese' } },
      { id: 'tomaatti', name: { fi: 'Tomaatti', en: 'Tomato' } },
      { id: 'salaatti', name: { fi: 'Jäävuorisalaatti', en: 'Lettuce' } },
      { id: 'majoneesi', name: { fi: 'Talon hampurilaismajoneesi', en: 'House burger mayo' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'fries',
        options: [
          { id: 'fries', name: { fi: 'Maalaisranskalaiset', en: 'Rustic fries' }, priceDelta: 0 },
          { id: 'sweet_potato', name: { fi: 'Rapeat bataattiranskalaiset', en: 'Sweet potato fries' }, priceDelta: 1.50 },
          { id: 'salad', name: { fi: 'Raikas vihersalaatti', en: 'Fresh side salad' }, priceDelta: 0 },
          { id: 'no_side', name: { fi: 'Ilman lisuketta (-1,00 €)', en: 'No side dish (-1.00 €)' }, priceDelta: -1.00 },
        ],
      },
      {
        id: 'bun',
        title: { fi: 'Sämpylän valinta', en: 'Bun choice' },
        defaultOptionId: 'brioche',
        options: [
          { id: 'brioche', name: { fi: 'Perinteinen briossisämpylä', en: 'Classic brioche bun' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton sämpylä', en: 'Gluten-free bun' }, priceDelta: 0 },
          { id: 'lettuce_wrap', name: { fi: 'Salaattikääre (Keto / Hiilihydraatiton)', en: 'Lettuce wrap (Keto / Low-carb)' }, priceDelta: 0 },
        ],
      },
      {
        id: 'sauce',
        title: { fi: 'Kastikkeen valinta', en: 'Sauce choice' },
        defaultOptionId: 'house_mayo',
        options: [
          { id: 'house_mayo', name: { fi: 'Talon hampurilaismajoneesi', en: 'House burger mayo' }, priceDelta: 0 },
          { id: 'garlic_mayo', name: { fi: 'Valkosipulimajoneesi (Aioli)', en: 'Garlic aioli mayo' }, priceDelta: 0 },
          { id: 'chili_mayo', name: { fi: 'Mieto chilimajoneesi', en: 'Mild chili mayo' }, priceDelta: 0 },
          { id: 'vegan_mayo', name: { fi: 'Vegaanimajoneesi', en: 'Vegan mayo' }, priceDelta: 0 },
          { id: 'no_sauce', name: { fi: 'Ilman majoneesia / kastiketta', en: 'No sauce / mayo' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'kanahampurilainen': {
    canCustomize: true,
    removals: [
      { id: 'coleslaw', name: { fi: 'Coleslaw-salaatti', en: 'Coleslaw' } },
      { id: 'maustekurkku', name: { fi: 'Maustekurkku', en: 'Pickles' } },
      { id: 'chilimajo', name: { fi: 'Chilimajoneesi', en: 'Chili mayo' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'fries',
        options: [
          { id: 'fries', name: { fi: 'Ranskalaiset', en: 'French fries' }, priceDelta: 0 },
          { id: 'sweet_potato', name: { fi: 'Rapeat bataattiranskalaiset', en: 'Sweet potato fries' }, priceDelta: 1.50 },
          { id: 'salad', name: { fi: 'Raikas vihersalaatti', en: 'Fresh side salad' }, priceDelta: 0 },
          { id: 'no_side', name: { fi: 'Ilman lisuketta (-1,00 €)', en: 'No side dish (-1.00 €)' }, priceDelta: -1.00 },
        ],
      },
      {
        id: 'bun',
        title: { fi: 'Sämpylän valinta', en: 'Bun choice' },
        defaultOptionId: 'brioche',
        options: [
          { id: 'brioche', name: { fi: 'Briossisämpylä', en: 'Brioche bun' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton sämpylä', en: 'Gluten-free bun' }, priceDelta: 0 },
          { id: 'lettuce_wrap', name: { fi: 'Salaattikääre (Keto)', en: 'Lettuce wrap (Keto)' }, priceDelta: 0 },
        ],
      },
      {
        id: 'sauce',
        title: { fi: 'Kastike', en: 'Sauce' },
        defaultOptionId: 'chili_mayo',
        options: [
          { id: 'chili_mayo', name: { fi: 'Mieto chilimajoneesi', en: 'Mild chili mayo' }, priceDelta: 0 },
          { id: 'house_mayo', name: { fi: 'Talon majoneesi', en: 'House mayo' }, priceDelta: 0 },
          { id: 'garlic_mayo', name: { fi: 'Valkosipulimajoneesi', en: 'Garlic mayo' }, priceDelta: 0 },
          { id: 'no_sauce', name: { fi: 'Ilman majoneesia', en: 'No sauce' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'kasvishampurilainen': {
    canCustomize: true,
    removals: [
      { id: 'avokado', name: { fi: 'Avokado', en: 'Avocado' } },
      { id: 'tomaatti', name: { fi: 'Tomaatti', en: 'Tomato' } },
      { id: 'salaatti', name: { fi: 'Raikas salaatti', en: 'Fresh lettuce' } },
      { id: 'vegejuusto', name: { fi: 'Vegaaninen juusto', en: 'Vegan cheese' } },
      { id: 'veganeesi', name: { fi: 'Valkosipuliveganeesi', en: 'Garlic vegan mayo' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'sweet_potato',
        options: [
          { id: 'sweet_potato', name: { fi: 'Bataattiranskalaiset', en: 'Sweet potato fries' }, priceDelta: 0 },
          { id: 'fries', name: { fi: 'Maalaisranskalaiset', en: 'Rustic fries' }, priceDelta: 0 },
          { id: 'salad', name: { fi: 'Raikas vihersalaatti', en: 'Fresh side salad' }, priceDelta: 0 },
          { id: 'no_side', name: { fi: 'Ilman lisuketta (-1,00 €)', en: 'No side dish (-1.00 €)' }, priceDelta: -1.00 },
        ],
      },
      {
        id: 'bun',
        title: { fi: 'Sämpylä', en: 'Bun' },
        defaultOptionId: 'vegan_bun',
        options: [
          { id: 'vegan_bun', name: { fi: 'Vegaaninen sämpylä', en: 'Vegan bun' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton sämpylä', en: 'Gluten-free bun' }, priceDelta: 0 },
          { id: 'lettuce_wrap', name: { fi: 'Salaattikääre', en: 'Lettuce wrap' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'klubi-sandwich': {
    canCustomize: true,
    removals: [
      { id: 'pekoni', name: { fi: 'Rapea pekoni', en: 'Crispy bacon' } },
      { id: 'muna', name: { fi: 'Keitetty kananmuna', en: 'Boiled egg' } },
      { id: 'tomaatti', name: { fi: 'Tomaatti', en: 'Tomato' } },
      { id: 'salaatti', name: { fi: 'Salaatti', en: 'Lettuce' } },
      { id: 'majoneesi', name: { fi: 'Majoneesi', en: 'Mayonnaise' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'fries',
        options: [
          { id: 'fries', name: { fi: 'Ranskalaiset', en: 'French fries' }, priceDelta: 0 },
          { id: 'sweet_potato', name: { fi: 'Bataattiranskalaiset', en: 'Sweet potato fries' }, priceDelta: 1.50 },
          { id: 'salad', name: { fi: 'Vihersalaatti', en: 'Side salad' }, priceDelta: 0 },
        ],
      },
      {
        id: 'bread',
        title: { fi: 'Leivän valinta', en: 'Bread choice' },
        defaultOptionId: 'white_toast',
        options: [
          { id: 'white_toast', name: { fi: 'Paahdettu vaalea leipä', en: 'Toasted white bread' }, priceDelta: 0 },
          { id: 'gluten_free_toast', name: { fi: 'Gluteeniton leipä', en: 'Gluten-free bread' }, priceDelta: 0 },
        ],
      },
    ],
  },

  // ==================== PÄÄRUOAT ====================
  'pariloitu-naudanpihvi': {
    canCustomize: true,
    removals: [
      { id: 'maustevoi', name: { fi: 'Yrttimaustevoi', en: 'Herb butter' } },
      { id: 'kasvikset', name: { fi: 'Paahdetut kauden kasvikset', en: 'Roasted vegetables' } },
      { id: 'suola', name: { fi: 'Pintasuola (vähäsuolainen)', en: 'Surface salt (low sodium)' } },
    ],
    swapGroups: [
      {
        id: 'doneness',
        title: { fi: 'Pihvin kypsyysaste', en: 'Steak doneness' },
        defaultOptionId: 'medium',
        options: [
          { id: 'rare', name: { fi: 'Rare (Verinen)', en: 'Rare' }, priceDelta: 0 },
          { id: 'medium_minus', name: { fi: 'Medium- (Puoliraaka)', en: 'Medium-rare' }, priceDelta: 0 },
          { id: 'medium', name: { fi: 'Medium (Suositus)', en: 'Medium (Chef recommendation)' }, priceDelta: 0 },
          { id: 'medium_plus', name: { fi: 'Medium+', en: 'Medium-well' }, priceDelta: 0 },
          { id: 'well_done', name: { fi: 'Kypsä (Well done)', en: 'Well done' }, priceDelta: 0 },
        ],
      },
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'fries',
        options: [
          { id: 'fries', name: { fi: 'Maalaisranskalaiset', en: 'Rustic fries' }, priceDelta: 0 },
          { id: 'mash', name: { fi: 'Voinen perunamuusi', en: 'Buttery mashed potatoes' }, priceDelta: 0 },
          { id: 'fried_potatoes', name: { fi: 'Paistetut perunat', en: 'Pan-fried potatoes' }, priceDelta: 0 },
          { id: 'boiled_potatoes', name: { fi: 'Keitetyt perunat tillillä', en: 'Boiled dill potatoes' }, priceDelta: 0 },
          { id: 'salad', name: { fi: 'Raikas vihersalaatti', en: 'Fresh green salad' }, priceDelta: 0 },
          { id: 'steamed_veg', name: { fi: 'Höyrytetyt kauden kasvikset', en: 'Steamed vegetables' }, priceDelta: 0 },
          { id: 'sweet_potato', name: { fi: 'Bataattiranskalaiset', en: 'Sweet potato fries' }, priceDelta: 1.50 },
          { id: 'no_side', name: { fi: 'Ilman lisuketta (-1,50 €)', en: 'No side dish (-1.50 €)' }, priceDelta: -1.50 },
        ],
      },
      {
        id: 'sauce',
        title: { fi: 'Kastikkeen tai maustevoin valinta', en: 'Sauce / Butter choice' },
        defaultOptionId: 'herb_butter',
        options: [
          { id: 'herb_butter', name: { fi: 'Talon yrttimaustevoi', en: 'House herb butter' }, priceDelta: 0 },
          { id: 'pepper_sauce', name: { fi: 'Kermaisa pippurikastike', en: 'Creamy black pepper sauce' }, priceDelta: 0 },
          { id: 'red_wine', name: { fi: 'Täyteläinen punaviinikastike', en: 'Rich red wine sauce' }, priceDelta: 0 },
          { id: 'bearnaise', name: { fi: 'Klassinen bearnaisekastike', en: 'Classic Béarnaise sauce' }, priceDelta: 0 },
          { id: 'sauce_side', name: { fi: 'Kastike erikseen kulhossa', en: 'Sauce on the side' }, priceDelta: 0 },
          { id: 'no_sauce', name: { fi: 'Ilman voita tai kastiketta', en: 'Without butter or sauce' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'paistettu-lohi': {
    canCustomize: true,
    removals: [
      { id: 'tilli', name: { fi: 'Tuore tilli', en: 'Fresh dill' } },
      { id: 'sitruuna', name: { fi: 'Sitruunalohko', en: 'Lemon wedge' } },
      { id: 'parsa', name: { fi: 'Höyrytetty parsa', en: 'Steamed asparagus' } },
      { id: 'hollandaise', name: { fi: 'Hollandaiskastike', en: 'Hollandaise sauce' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Perunalisukkeen valinta', en: 'Potato side choice' },
        defaultOptionId: 'dill_potatoes',
        options: [
          { id: 'dill_potatoes', name: { fi: 'Tilliperunat', en: 'Dill potatoes' }, priceDelta: 0 },
          { id: 'mash', name: { fi: 'Perunamuusi', en: 'Mashed potatoes' }, priceDelta: 0 },
          { id: 'fried_potatoes', name: { fi: 'Paistetut perunat', en: 'Pan-fried potatoes' }, priceDelta: 0 },
          { id: 'salad', name: { fi: 'Raikas vihersalaatti', en: 'Fresh green salad' }, priceDelta: 0 },
          { id: 'fries', name: { fi: 'Maalaisranskalaiset', en: 'Rustic fries' }, priceDelta: 0 },
          { id: 'no_potatoes', name: { fi: 'Vain kasvikset ilman perunoita', en: 'Only veggies (no potatoes)' }, priceDelta: 0 },
        ],
      },
      {
        id: 'sauce',
        title: { fi: 'Kastikkeen valinta', en: 'Sauce choice' },
        defaultOptionId: 'hollandaise',
        options: [
          { id: 'hollandaise', name: { fi: 'Sitruuna-hollandaiskastike', en: 'Lemon hollandaise' }, priceDelta: 0 },
          { id: 'butter_sauce', name: { fi: 'Kirkastettu voikastike tillillä', en: 'Clarified dill butter' }, priceDelta: 0 },
          { id: 'white_wine', name: { fi: 'Valkoviinikastike', en: 'White wine sauce' }, priceDelta: 0 },
          { id: 'sauce_side', name: { fi: 'Kastike erikseen kulhossa', en: 'Sauce on the side' }, priceDelta: 0 },
          { id: 'no_sauce', name: { fi: 'Ilman kastiketta', en: 'No sauce' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'grillattu-kana': {
    canCustomize: true,
    removals: [
      { id: 'pavut', name: { fi: 'Vihreät pavut', en: 'Green beans' } },
      { id: 'punaviinikastike', name: { fi: 'Punaviinikastike', en: 'Red wine sauce' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'sweet_potato_puree',
        options: [
          { id: 'sweet_potato_puree', name: { fi: 'Bataattipyree', en: 'Sweet potato purée' }, priceDelta: 0 },
          { id: 'mash', name: { fi: 'Perunamuusi', en: 'Mashed potatoes' }, priceDelta: 0 },
          { id: 'fries', name: { fi: 'Maalaisranskalaiset', en: 'Rustic fries' }, priceDelta: 0 },
          { id: 'salad', name: { fi: 'Raikas vihersalaatti', en: 'Fresh green salad' }, priceDelta: 0 },
          { id: 'fried_potatoes', name: { fi: 'Paistetut perunat', en: 'Fried potatoes' }, priceDelta: 0 },
        ],
      },
      {
        id: 'sauce',
        title: { fi: 'Kastike', en: 'Sauce' },
        defaultOptionId: 'red_wine',
        options: [
          { id: 'red_wine', name: { fi: 'Punaviinikastike', en: 'Red wine reduction' }, priceDelta: 0 },
          { id: 'pepper', name: { fi: 'Pippurikastike', en: 'Pepper sauce' }, priceDelta: 0 },
          { id: 'bearnaise', name: { fi: 'Bearnaisekastike', en: 'Béarnaise sauce' }, priceDelta: 0 },
          { id: 'sauce_side', name: { fi: 'Kastike erikseen kulhossa', en: 'Sauce on the side' }, priceDelta: 0 },
          { id: 'no_sauce', name: { fi: 'Ilman kastiketta', en: 'No sauce' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'lihapullat-muusi': {
    canCustomize: true,
    removals: [
      { id: 'puolukka', name: { fi: 'Puolukkahillo', en: 'Lingonberry jam' } },
      { id: 'suolakurkku', name: { fi: 'Suolakurkut', en: 'Pickled cucumbers' } },
      { id: 'kermakastike', name: { fi: 'Kermakastike', en: 'Cream gravy' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'mash',
        options: [
          { id: 'mash', name: { fi: 'Voilla aateloitu perunamuusi', en: 'Fluffy buttered mashed potatoes' }, priceDelta: 0 },
          { id: 'boiled_potatoes', name: { fi: 'Keitetyt perunat', en: 'Boiled potatoes' }, priceDelta: 0 },
          { id: 'fries', name: { fi: 'Maalaisranskalaiset', en: 'Rustic fries' }, priceDelta: 0 },
          { id: 'fried_potatoes', name: { fi: 'Paistetut perunat', en: 'Pan-fried potatoes' }, priceDelta: 0 },
          { id: 'salad', name: { fi: 'Raikas vihersalaatti', en: 'Side salad' }, priceDelta: 0 },
        ],
      },
      {
        id: 'sauce',
        title: { fi: 'Kastikkeen valinta', en: 'Sauce choice' },
        defaultOptionId: 'gravy',
        options: [
          { id: 'gravy', name: { fi: 'Perinteinen kermakastike', en: 'Traditional cream gravy' }, priceDelta: 0 },
          { id: 'pepper_sauce', name: { fi: 'Pippurikastike', en: 'Pepper sauce' }, priceDelta: 0 },
          { id: 'sauce_side', name: { fi: 'Kermakastike erikseen kulhossa', en: 'Gravy on the side' }, priceDelta: 0 },
          { id: 'no_sauce', name: { fi: 'Ilman kastiketta', en: 'No gravy' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'wieninleike': {
    canCustomize: true,
    removals: [
      { id: 'anjovis', name: { fi: 'Anjovisfilee', en: 'Anchovy fillet' } },
      { id: 'kaprikset', name: { fi: 'Kaprikset', en: 'Capers' } },
      { id: 'sitruuna', name: { fi: 'Sitruunaviipale', en: 'Lemon slice' } },
    ],
    swapGroups: [
      {
        id: 'side',
        title: { fi: 'Lisukkeen valinta', en: 'Side choice' },
        defaultOptionId: 'fries',
        options: [
          { id: 'fries', name: { fi: 'Ranskanperunat', en: 'French fries' }, priceDelta: 0 },
          { id: 'mash', name: { fi: 'Perunamuusi', en: 'Mashed potatoes' }, priceDelta: 0 },
          { id: 'fried_potatoes', name: { fi: 'Paistetut perunat', en: 'Pan-fried potatoes' }, priceDelta: 0 },
          { id: 'boiled_potatoes', name: { fi: 'Keitetyt perunat', en: 'Boiled potatoes' }, priceDelta: 0 },
          { id: 'salad', name: { fi: 'Vihersalaatti', en: 'Side salad' }, priceDelta: 0 },
        ],
      },
    ],
  },

  // ==================== PASTAT ====================
  'pasta-bolognese': {
    canCustomize: true,
    removals: [
      { id: 'parmesaani', name: { fi: 'Parmesaaniraaste', en: 'Grated parmesan' } },
      { id: 'mustapippuri', name: { fi: 'Mustapippuri', en: 'Black pepper' } },
    ],
    swapGroups: [
      {
        id: 'pasta_type',
        title: { fi: 'Pastan valinta', en: 'Pasta choice' },
        defaultOptionId: 'tagliatelle',
        options: [
          { id: 'tagliatelle', name: { fi: 'Perinteinen tagliatelle', en: 'Traditional tagliatelle' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton pasta', en: 'Gluten-free pasta' }, priceDelta: 0 },
          { id: 'spaghetti', name: { fi: 'Spagetti', en: 'Spaghetti' }, priceDelta: 0 },
          { id: 'penne', name: { fi: 'Penne-pasta', en: 'Penne pasta' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'pasta-carbonara': {
    canCustomize: true,
    removals: [
      { id: 'mustapippuri', name: { fi: 'Mustapippuri', en: 'Black pepper' } },
      { id: 'pekoni', name: { fi: 'Pekoni / Pancetta', en: 'Bacon / Pancetta' } },
      { id: 'juusto', name: { fi: 'Pecorino- & parmesaanijuusto', en: 'Pecorino & parmesan' } },
    ],
    swapGroups: [
      {
        id: 'pasta_type',
        title: { fi: 'Pastan valinta', en: 'Pasta choice' },
        defaultOptionId: 'spaghetti',
        options: [
          { id: 'spaghetti', name: { fi: 'Spagetti', en: 'Spaghetti' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton pasta', en: 'Gluten-free pasta' }, priceDelta: 0 },
          { id: 'tagliatelle', name: { fi: 'Tagliatelle', en: 'Tagliatelle' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'tomaatti-basilika-pasta': {
    canCustomize: true,
    removals: [
      { id: 'pinjansiemenet', name: { fi: 'Paahdetut pinjansiemenet', en: 'Toasted pine nuts' } },
      { id: 'valkosipuli', name: { fi: 'Valkosipuli', en: 'Garlic' } },
      { id: 'basilika', name: { fi: 'Tuore basilika', en: 'Fresh basil' } },
    ],
    swapGroups: [
      {
        id: 'pasta_type',
        title: { fi: 'Pastan valinta', en: 'Pasta choice' },
        defaultOptionId: 'penne',
        options: [
          { id: 'penne', name: { fi: 'Penne-pasta', en: 'Penne pasta' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton pasta', en: 'Gluten-free pasta' }, priceDelta: 0 },
          { id: 'spaghetti', name: { fi: 'Spagetti', en: 'Spaghetti' }, priceDelta: 0 },
        ],
      },
      {
        id: 'cheese',
        title: { fi: 'Juuston lisäys', en: 'Cheese topping' },
        defaultOptionId: 'parmesan',
        options: [
          { id: 'parmesan', name: { fi: 'Parmesaaniraaste', en: 'Grated parmesan' }, priceDelta: 0 },
          { id: 'vegan_cheese', name: { fi: 'Vegaaninen juusto', en: 'Vegan cheese' }, priceDelta: 0 },
          { id: 'no_cheese', name: { fi: 'Ilman juustoa (100% vegaani)', en: 'No cheese (100% vegan)' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'kasviswokki': {
    canCustomize: true,
    removals: [
      { id: 'seesami', name: { fi: 'Seesaminsiemenet', en: 'Sesame seeds' } },
      { id: 'korianteri', name: { fi: 'Tuore korianteri', en: 'Fresh cilantro' } },
      { id: 'chili', name: { fi: 'Chili (miedompi wokki)', en: 'Chili (mild)' } },
    ],
    swapGroups: [
      {
        id: 'base',
        title: { fi: 'Pohjan valinta', en: 'Base choice' },
        defaultOptionId: 'jasmine_rice',
        options: [
          { id: 'jasmine_rice', name: { fi: 'Jasmiiniriisi', en: 'Jasmine rice' }, priceDelta: 0 },
          { id: 'rice_noodles', name: { fi: 'Riisinuudelit', en: 'Rice noodles' }, priceDelta: 0 },
          { id: 'only_veg', name: { fi: 'Pelkät kasvikset (ei riisiä tai nuudelia)', en: 'Vegetables only (no carbs)' }, priceDelta: 0 },
        ],
      },
      {
        id: 'protein',
        title: { fi: 'Proteiini', en: 'Protein' },
        defaultOptionId: 'tofu',
        options: [
          { id: 'tofu', name: { fi: 'Paistettu maustettu tofu', en: 'Pan-fried seasoned tofu' }, priceDelta: 0 },
          { id: 'extra_veg', name: { fi: 'Tuplakasvikset tofua korvaamaan', en: 'Extra vegetables instead of tofu' }, priceDelta: 0 },
        ],
      },
    ],
  },

  // ==================== SALAATIT ====================
  'kanasalaatti': {
    canCustomize: true,
    removals: [
      { id: 'avokado', name: { fi: 'Avokadoviipaleet', en: 'Sliced avocado' } },
      { id: 'kirsikkatomaatti', name: { fi: 'Kirsikkatomaatit', en: 'Cherry tomatoes' } },
      { id: 'kurkku', name: { fi: 'Kurkku', en: 'Cucumber' } },
      { id: 'kastike', name: { fi: 'Yrttikastike', en: 'Herb dressing' } },
    ],
    swapGroups: [
      {
        id: 'dressing',
        title: { fi: 'Kastikkeen valinta', en: 'Dressing choice' },
        defaultOptionId: 'herb_dressing',
        options: [
          { id: 'herb_dressing', name: { fi: 'Kevyt yrttikastike', en: 'Light herb dressing' }, priceDelta: 0 },
          { id: 'citrus_vinaigrette', name: { fi: 'Talon sitrusvinaigrette', en: 'Citrus vinaigrette' }, priceDelta: 0 },
          { id: 'olive_oil_vinegar', name: { fi: 'Neitsytoliiviöljy & balsamico', en: 'Olive oil & balsamic' }, priceDelta: 0 },
          { id: 'dressing_side', name: { fi: 'Kastike erikseen kulhossa', en: 'Dressing on the side' }, priceDelta: 0 },
          { id: 'no_dressing', name: { fi: 'Ilman kastiketta', en: 'No dressing' }, priceDelta: 0 },
        ],
      },
      {
        id: 'protein_swap',
        title: { fi: 'Proteiinin vaihto', en: 'Protein swap' },
        defaultOptionId: 'chicken',
        options: [
          { id: 'chicken', name: { fi: 'Pariloitu kananrinta', en: 'Grilled chicken breast' }, priceDelta: 0 },
          { id: 'goat_cheese', name: { fi: 'Paahdettu vuohenjuusto', en: 'Warm goat cheese' }, priceDelta: 1.00 },
          { id: 'tofu', name: { fi: 'Paistettu maustettu tofu', en: 'Seasoned fried tofu' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'vuohenjuustosalaatti': {
    canCustomize: true,
    removals: [
      { id: 'punajuuri', name: { fi: 'Marinoitu punajuuri', en: 'Marinated beetroot' } },
      { id: 'pähkinät', name: { fi: 'Saksanpähkinät', en: 'Walnuts' } },
      { id: 'balsamico', name: { fi: 'Balsamicosiirappi', en: 'Balsamic glaze' } },
    ],
    swapGroups: [
      {
        id: 'nuts_swap',
        title: { fi: 'Pähkinöiden vaihto', en: 'Nuts swap' },
        defaultOptionId: 'walnuts',
        options: [
          { id: 'walnuts', name: { fi: 'Saksanpähkinät', en: 'Walnuts' }, priceDelta: 0 },
          { id: 'sunflower_seeds', name: { fi: 'Paahdetut auringonkukansiemenet (pähkinätön)', en: 'Sunflower seeds (nut-free)' }, priceDelta: 0 },
          { id: 'no_nuts', name: { fi: 'Ilman pähkinöitä tai siemeniä', en: 'No nuts or seeds' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'kreikkalainen-salaatti': {
    canCustomize: true,
    removals: [
      { id: 'oliivit', name: { fi: 'Kalamata-oliivit', en: 'Kalamata olives' } },
      { id: 'punasipuli', name: { fi: 'Punasipuli', en: 'Red onion' } },
      { id: 'feta', name: { fi: 'Fetajuusto', en: 'Feta cheese' } },
      { id: 'oregano', name: { fi: 'Oregano', en: 'Oregano' } },
    ],
    swapGroups: [
      {
        id: 'cheese_choice',
        title: { fi: 'Juuston valinta', en: 'Cheese choice' },
        defaultOptionId: 'feta',
        options: [
          { id: 'feta', name: { fi: 'Aito kreikkalainen feta', en: 'Authentic Greek feta' }, priceDelta: 0 },
          { id: 'vegan_feta', name: { fi: 'Vegaaninen salaattijuusto', en: 'Vegan feta-style cheese' }, priceDelta: 0 },
          { id: 'no_feta', name: { fi: 'Ilman juustoa', en: 'No cheese' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'tofusalaatti': {
    canCustomize: true,
    removals: [
      { id: 'edamame', name: { fi: 'Edamame-pavut', en: 'Edamame beans' } },
      { id: 'retiisi', name: { fi: 'Retiisi', en: 'Radishes' } },
      { id: 'seesami', name: { fi: 'Seesaminsiemenet', en: 'Sesame seeds' } },
      { id: 'kastike', name: { fi: 'Inkiväärikastike', en: 'Ginger dressing' } },
    ],
    swapGroups: [
      {
        id: 'dressing',
        title: { fi: 'Kastikkeen valinta', en: 'Dressing choice' },
        defaultOptionId: 'ginger',
        options: [
          { id: 'ginger', name: { fi: 'Seesami-inkiväärikastike', en: 'Sesame-ginger dressing' }, priceDelta: 0 },
          { id: 'citrus', name: { fi: 'Sitrusvinaigrette', en: 'Citrus vinaigrette' }, priceDelta: 0 },
          { id: 'dressing_side', name: { fi: 'Kastike erikseen', en: 'Dressing on the side' }, priceDelta: 0 },
          { id: 'no_dressing', name: { fi: 'Ilman kastiketta', en: 'No dressing' }, priceDelta: 0 },
        ],
      },
    ],
  },

  // ==================== KEITOT ====================
  'kermainen-lohikeitto': {
    canCustomize: true,
    removals: [
      { id: 'tilli', name: { fi: 'Tuore tilli', en: 'Fresh dill' } },
      { id: 'voi', name: { fi: 'Voi leivän päälle', en: 'Butter on bread' } },
      { id: 'purjo', name: { fi: 'Purjo', en: 'Leek' } },
      { id: 'leipa', name: { fi: 'Leipä', en: 'Bread' } },
    ],
    swapGroups: [
      {
        id: 'bread_swap',
        title: { fi: 'Leivän valinta', en: 'Bread choice' },
        defaultOptionId: 'rye',
        options: [
          { id: 'rye', name: { fi: 'Perinteinen ruisleipä', en: 'Traditional rye bread' }, priceDelta: 0 },
          { id: 'archipelago', name: { fi: 'Saaristolaisleipä', en: 'Archipelago bread' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton leipä', en: 'Gluten-free bread' }, priceDelta: 0 },
          { id: 'no_bread', name: { fi: 'Ilman leipää', en: 'Without bread' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'tomaatti-basilikakeitto': {
    canCustomize: true,
    removals: [
      { id: 'basilika', name: { fi: 'Tuore basilika', en: 'Fresh basil' } },
      { id: 'yrttioljy', name: { fi: 'Yrttiöljy', en: 'Herb oil' } },
      { id: 'leipa', name: { fi: 'Leipä', en: 'Bread' } },
    ],
    swapGroups: [
      {
        id: 'bread_swap',
        title: { fi: 'Leivän valinta', en: 'Bread choice' },
        defaultOptionId: 'artisan',
        options: [
          { id: 'artisan', name: { fi: 'Vaalea maalaisleipä', en: 'Artisan white bread' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton leipä', en: 'Gluten-free bread' }, priceDelta: 0 },
          { id: 'no_bread', name: { fi: 'Ilman leipää', en: 'Without bread' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'sienikeitto': {
    canCustomize: true,
    removals: [
      { id: 'timjami', name: { fi: 'Tuore timjami', en: 'Fresh thyme' } },
      { id: 'kerma', name: { fi: 'Kermakoristelu', en: 'Cream swirl' } },
      { id: 'leipa', name: { fi: 'Leipä', en: 'Bread' } },
    ],
    swapGroups: [
      {
        id: 'bread_swap',
        title: { fi: 'Leipä', en: 'Bread' },
        defaultOptionId: 'rye',
        options: [
          { id: 'rye', name: { fi: 'Ruisleipä', en: 'Rye bread' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton leipä', en: 'Gluten-free bread' }, priceDelta: 0 },
          { id: 'no_bread', name: { fi: 'Ilman leipää', en: 'Without bread' }, priceDelta: 0 },
        ],
      },
    ],
  },

  // ==================== ALKURUOAT ====================
  'vihrea-alkusalaatti': {
    canCustomize: true,
    removals: [
      { id: 'punasipuli', name: { fi: 'Pikkelöity punasipuli', en: 'Pickled red onion' } },
      { id: 'tomaatti', name: { fi: 'Kirsikkatomaatit', en: 'Cherry tomatoes' } },
      { id: 'kurkku', name: { fi: 'Kurkku', en: 'Cucumber' } },
      { id: 'kastike', name: { fi: 'Sitrusvinaigrette', en: 'Citrus vinaigrette' } },
    ],
    swapGroups: [
      {
        id: 'dressing',
        title: { fi: 'Kastike', en: 'Dressing' },
        defaultOptionId: 'citrus',
        options: [
          { id: 'citrus', name: { fi: 'Talon sitrusvinaigrette', en: 'Citrus vinaigrette' }, priceDelta: 0 },
          { id: 'olive_oil', name: { fi: 'Oliiviöljy & balsamico', en: 'Olive oil & balsamic' }, priceDelta: 0 },
          { id: 'dressing_side', name: { fi: 'Kastike erikseen', en: 'Dressing on the side' }, priceDelta: 0 },
          { id: 'no_dressing', name: { fi: 'Ilman kastiketta', en: 'No dressing' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'valkosipulileivat': {
    canCustomize: true,
    removals: [
      { id: 'parmesaani', name: { fi: 'Parmesaaniraaste', en: 'Grated parmesan' } },
    ],
    swapGroups: [
      {
        id: 'bread',
        title: { fi: 'Leipätyyppi', en: 'Bread type' },
        defaultOptionId: 'white_bread',
        options: [
          { id: 'white_bread', name: { fi: 'Vaalea maalaisleipä', en: 'Rustic white bread' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton leipä', en: 'Gluten-free bread' }, priceDelta: 0 },
          { id: 'rye_bread', name: { fi: 'Ruisleipä', en: 'Rye bread' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'mozzarellatikut': {
    canCustomize: true,
    removals: [
      { id: 'salsa', name: { fi: 'Tomaattisalsa', en: 'Tomato salsa' } },
      { id: 'mayo', name: { fi: 'Majoneesi', en: 'Mayonnaise' } },
    ],
    swapGroups: [
      {
        id: 'dip',
        title: { fi: 'Dipin valinta', en: 'Dip choice' },
        defaultOptionId: 'both',
        options: [
          { id: 'both', name: { fi: 'Tomaattisalsa & majoneesi', en: 'Tomato salsa & mayo' }, priceDelta: 0 },
          { id: 'garlic_mayo', name: { fi: 'Valkosipulimajoneesi (Aioli)', en: 'Garlic aioli' }, priceDelta: 0 },
          { id: 'chili_mayo', name: { fi: 'Chilimajoneesi', en: 'Chili mayo' }, priceDelta: 0 },
          { id: 'salsa_only', name: { fi: 'Vain tomaattisalsa (maidoton)', en: 'Tomato salsa only (dairy-free)' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'toast-skagen': {
    canCustomize: true,
    removals: [
      { id: 'mati', name: { fi: 'Kirjolohenmäti', en: 'Trout roe' } },
      { id: 'tilli', name: { fi: 'Tilli', en: 'Dill' } },
      { id: 'sitruuna', name: { fi: 'Sitruuna', en: 'Lemon' } },
    ],
    swapGroups: [
      {
        id: 'bread',
        title: { fi: 'Leivän valinta', en: 'Bread choice' },
        defaultOptionId: 'brioche',
        options: [
          { id: 'brioche', name: { fi: 'Paahdettu briossi', en: 'Toasted brioche' }, priceDelta: 0 },
          { id: 'archipelago', name: { fi: 'Saaristolaisleipä', en: 'Archipelago bread' }, priceDelta: 0 },
          { id: 'gluten_free', name: { fi: 'Gluteeniton leipä', en: 'Gluten-free bread' }, priceDelta: 0 },
        ],
      },
    ],
  },

  // ==================== JÄLKIRUOAT ====================
  'perinteiset-letut': {
    canCustomize: true,
    removals: [
      { id: 'hillo', name: { fi: 'Mansikkahillo', en: 'Strawberry jam' } },
      { id: 'jaatelo_tai_kerma', name: { fi: 'Jäätelö / kermavaahto', en: 'Ice cream / cream' } },
    ],
    swapGroups: [
      {
        id: 'dairy_side',
        title: { fi: 'Lisukkeen valinta', en: 'Accompaniment choice' },
        defaultOptionId: 'vanilla_icecream',
        options: [
          { id: 'vanilla_icecream', name: { fi: 'Aito vaniljajäätelö', en: 'Real vanilla ice cream' }, priceDelta: 0 },
          { id: 'whipped_cream', name: { fi: 'Vispattu kermavaahto', en: 'Whipped cream' }, priceDelta: 0 },
          { id: 'oat_cream', name: { fi: 'Kauravaahto (vegaaninen / maidoton)', en: 'Oat whip (vegan/dairy-free)' }, priceDelta: 0 },
          { id: 'both', name: { fi: 'Sekä jäätelö että kermavaahto (+1,00 €)', en: 'Both ice cream & cream (+1.00 €)' }, priceDelta: 1.00 },
          { id: 'none', name: { fi: 'Ilman jäätelöä tai kermavaahtoa', en: 'Without ice cream or cream' }, priceDelta: 0 },
        ],
      },
      {
        id: 'jam_choice',
        title: { fi: 'Hillon valinta', en: 'Jam choice' },
        defaultOptionId: 'strawberry',
        options: [
          { id: 'strawberry', name: { fi: 'Makea mansikkahillo', en: 'Sweet strawberry jam' }, priceDelta: 0 },
          { id: 'raspberry', name: { fi: 'Vadelmahillo', en: 'Raspberry jam' }, priceDelta: 0 },
          { id: 'cloudberry', name: { fi: 'Lakkahillo (+1,50 €)', en: 'Cloudberry jam (+1.50 €)' }, priceDelta: 1.50 },
          { id: 'maple_syrup', name: { fi: 'Vaahterasiirappi', en: 'Maple syrup' }, priceDelta: 0 },
        ],
      },
    ],
  },

  'jaateloannos': {
    canCustomize: true,
    removals: [
      { id: 'kastike', name: { fi: 'Suklaakastike', en: 'Chocolate sauce' } },
      { id: 'kermavaahto', name: { fi: 'Kermavaahto', en: 'Whipped cream' } },
      { id: 'vohveli', name: { fi: 'Vohvelitikku (gluteenillinen)', en: 'Wafer stick (contains gluten)' } },
    ],
    swapGroups: [
      {
        id: 'sauce',
        title: { fi: 'Kastikkeen valinta', en: 'Sauce choice' },
        defaultOptionId: 'chocolate',
        options: [
          { id: 'chocolate', name: { fi: 'Täyteläinen suklaakastike', en: 'Rich chocolate sauce' }, priceDelta: 0 },
          { id: 'caramel', name: { fi: 'Talon kinuskikastike', en: 'House caramel sauce' }, priceDelta: 0 },
          { id: 'strawberry', name: { fi: 'Mansikkakastike', en: 'Strawberry sauce' }, priceDelta: 0 },
          { id: 'no_sauce', name: { fi: 'Ilman kastiketta', en: 'No sauce' }, priceDelta: 0 },
        ],
      },
    ],
  },

  // ==================== JUOMAT ====================
  'kahvi-tee': {
    canCustomize: true,
    removals: [
      { id: 'sokeri', name: { fi: 'Sokeri / makeutus', en: 'Sugar / sweetener' } },
    ],
    swapGroups: [
      {
        id: 'milk_choice',
        title: { fi: 'Maidon valinta', en: 'Milk choice' },
        defaultOptionId: 'organic_milk',
        options: [
          { id: 'organic_milk', name: { fi: 'Luomumaito', en: 'Organic cow milk' }, priceDelta: 0 },
          { id: 'oat_milk', name: { fi: 'Kaurajuoma (Oatly iKaffe)', en: 'Oat milk (Oatly iKaffe)' }, priceDelta: 0 },
          { id: 'lactose_free', name: { fi: 'Laktoositon maito', en: 'Lactose-free milk' }, priceDelta: 0 },
          { id: 'soy_milk', name: { fi: 'Soijajuoma', en: 'Soy milk' }, priceDelta: 0 },
          { id: 'black', name: { fi: 'Mustana (ilman maitoa)', en: 'Black (no milk)' }, priceDelta: 0 },
        ],
      },
      {
        id: 'type_choice',
        title: { fi: 'Juomatyyppi', en: 'Drink type' },
        defaultOptionId: 'dark_roast',
        options: [
          { id: 'dark_roast', name: { fi: 'Tummapaahtoinen luomukahvi', en: 'Dark roast organic coffee' }, priceDelta: 0 },
          { id: 'light_roast', name: { fi: 'Vaaleapaahtoinen luomukahvi', en: 'Light roast organic coffee' }, priceDelta: 0 },
          { id: 'green_tea', name: { fi: 'Haudutettu vihreä tee', en: 'Brewed green tea' }, priceDelta: 0 },
          { id: 'black_tea', name: { fi: 'Haudutettu musta tee (Earl Grey)', en: 'Brewed black tea (Earl Grey)' }, priceDelta: 0 },
          { id: 'rooibos_tea', name: { fi: 'Kofeiiniton rooibos-tee', en: 'Caffeine-free rooibos tea' }, priceDelta: 0 },
        ],
      },
    ],
  },
};

/**
 * Checks if a dish has customization options available.
 */
export function isDishCustomizable(dish: MenuItem): boolean {
  const custom = dish.customization || DEFAULT_DISH_CUSTOMIZATIONS[dish.id];
  if (!custom || custom.canCustomize === false) return false;
  const hasRemovals = Boolean(custom.removals && custom.removals.length > 0);
  const hasSwaps = Boolean(custom.swapGroups && custom.swapGroups.length > 0);
  return hasRemovals || hasSwaps;
}

/**
 * Gets the active customization definition for a dish.
 */
export function getDishCustomization(dish: MenuItem): DishCustomization | undefined {
  if (dish.customization) return dish.customization;
  return DEFAULT_DISH_CUSTOMIZATIONS[dish.id];
}

/**
 * Calculates the total item price including base price and any swap price deltas.
 */
export function calculateCustomizationPrice(
  basePrice: number,
  dish: MenuItem,
  selection: DishCustomizationSelection
): number {
  const custom = getDishCustomization(dish);
  if (!custom || !custom.swapGroups) return basePrice;

  let totalDelta = 0;
  for (const group of custom.swapGroups) {
    const selectedOptionId = selection.selectedSwaps[group.id] || group.defaultOptionId;
    if (selectedOptionId) {
      const opt = group.options.find((o) => o.id === selectedOptionId);
      if (opt && opt.priceDelta) {
        totalDelta += opt.priceDelta;
      }
    }
  }

  const finalPrice = basePrice + totalDelta;
  return Math.max(finalPrice, 0);
}

/**
 * Builds a structured summary of removals and swaps for display in carts and waiter tickets.
 */
export function buildCustomizationSummary(
  dish: MenuItem,
  selection: DishCustomizationSelection
): OrderItemCustomizationSummary {
  const custom = getDishCustomization(dish);
  const removals: Translation[] = [];
  const swaps: {
    groupTitle: Translation;
    optionName: Translation;
    priceDelta?: number;
  }[] = [];

  if (custom) {
    // Process removals
    if (custom.removals) {
      for (const remId of selection.removedIds) {
        const item = custom.removals.find((r) => r.id === remId);
        if (item) {
          removals.push({
            fi: `Ei ${item.name.fi.toLowerCase()}`,
            en: `No ${item.name.en.toLowerCase()}`,
          });
        }
      }
    }

    // Process swaps (only include if different from default, or if required choice like doneness)
    if (custom.swapGroups) {
      for (const group of custom.swapGroups) {
        const chosenId = selection.selectedSwaps[group.id] || group.defaultOptionId;
        if (chosenId) {
          const chosenOpt = group.options.find((o) => o.id === chosenId);
          // Highlight if different from default OR if it's a critical choice (like doneness/kypsyysaste)
          const isNonDefault = group.defaultOptionId ? chosenId !== group.defaultOptionId : true;
          const isCrucialGroup = group.id === 'doneness' || group.id === 'side' || group.id === 'milk_choice';

          if (chosenOpt && (isNonDefault || isCrucialGroup)) {
            swaps.push({
              groupTitle: group.title,
              optionName: chosenOpt.name,
              priceDelta: chosenOpt.priceDelta,
            });
          }
        }
      }
    }
  }

  return {
    removals,
    swaps,
    specialNotes: selection.specialNotes?.trim() || undefined,
  };
}

/**
 * Generates a unique cart item ID taking into account removals and swap choices.
 */
export function generateCustomizedOrderItemId(
  menuItemId: string,
  optionIndex?: number,
  selection?: DishCustomizationSelection
): string {
  let base = optionIndex !== undefined ? `${menuItemId}-opt-${optionIndex}` : menuItemId;
  if (!selection) return base;

  const remStr = selection.removedIds.slice().sort().join(',');
  const swapStr = Object.entries(selection.selectedSwaps)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
  const noteStr = selection.specialNotes ? `_${selection.specialNotes.slice(0, 10)}` : '';

  if (!remStr && !swapStr && !noteStr) {
    return base;
  }

  // Generate deterministic short suffix
  const combined = `${remStr}|${swapStr}|${noteStr}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return `${base}-custom-${Math.abs(hash).toString(36)}`;
}

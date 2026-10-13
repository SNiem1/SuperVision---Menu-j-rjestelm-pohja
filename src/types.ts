export interface Translation {
  fi: string;
  en: string;
}

export interface OpeningHourPeriod {
  dayRange: Translation;
  hours: string;
}

export interface RestaurantConfig {
  slug: string;
  name: string;
  tagline: Translation;
  description: Translation;
  foundingYear?: number;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  openingHours: OpeningHourPeriod[];
  logoUrl: string;
  faviconUrl: string;
  brandColors: {
    blue: string;
    gold: string;
    goldText?: string;
    cream: string;
    ink: string;
  };
  legal: {
    entityName: string;
    businessId: string;
  };
  currency: string;
  locale: string;
  categories: Category[];
}

export type AllergenKey =
  | 'G'          // Gluteeniton (Gluten-free)
  | 'L'          // Laktoositon (Lactose-free)
  | 'VL'         // Vähälaktoosinen (Low lactose)
  | 'M'          // Maidoton (Dairy-free)
  | 'Vegan'      // Vegaaninen (Vegan)
  | 'KASV'       // Kasvisruoka (Vegetarian)
  | 'P'          // Pähkinätön (Nut-free)
  | 'KAN'        // Kananmunaton (Egg-free)
  | 'SOY_FREE'   // Soijaton (Soy-free)
  | 'KAL_FREE'   // Kalaton (Fish-free)
  | 'AYR_FREE'   // Äyriäistön (Shellfish-free)
  | 'VALK_FREE'  // Valkosipuliton (Garlic-free)
  | 'SIK_FREE'   // Sianlihaton (Pork-free)
  | 'KETO'       // Keto / Vähähiilihydraattinen (Keto / Low carb)
  | 'FODMAP'     // Low FODMAP
  | 'SOKERITON'  // Sokeriton / Ei lisättyä sokeria (Sugar-free)
  | 'Gluten'     // Sisältää gluteenia
  | 'Dairy'      // Sisältää maitoa
  | 'Soy'        // Sisältää soijaa
  | 'Eggs'       // Sisältää kananmunaa
  | 'Fish'       // Sisältää kalaa
  | 'Shellfish'  // Sisältää äyriäisiä
  | 'Nuts'       // Sisältää pähkinöitä
  | 'Pork'       // Sisältää sianlihaa
  | 'Garlic'     // Sisältää valkosipulia
  | 'FI'         // Kotimaiset raaka-aineet
  | 'Organic';   // Luomu


export type AllergenKind = 'free-from' | 'contains' | 'origin';

export interface Allergen {
  key: AllergenKey;
  kind: AllergenKind;
  name: Translation;
  partitiveName?: Translation;
  description?: Translation;
  bgClass: string;
  textClass: string;
  iconSymbol?: string;
}

export interface PriceOption {
  label: Translation;
  value: number;
}

export interface CustomizationRemoval {
  id: string;
  name: Translation;
}

export interface CustomizationSwapOption {
  id: string;
  name: Translation;
  priceDelta?: number; // e.g. 0 or +1.50
}

export interface CustomizationSwapGroup {
  id: string;
  title: Translation; // e.g. { fi: 'Lisukkeen valinta', en: 'Side dish choice' }
  defaultOptionId?: string; // which option is the default
  options: CustomizationSwapOption[];
}

export interface DishCustomization {
  canCustomize: boolean;
  removals?: CustomizationRemoval[];
  swapGroups?: CustomizationSwapGroup[];
}

export interface DishCustomizationSelection {
  removedIds: string[];
  selectedSwaps: Record<string, string>; // swapGroupId -> optionId
  specialNotes?: string;
}

export interface OrderItemCustomizationSummary {
  removals: Translation[];
  swaps: {
    groupTitle: Translation;
    optionName: Translation;
    priceDelta?: number;
  }[];
  specialNotes?: string;
}

export interface OrderItem {
  id: string; // unique identifier e.g. menuItem.id + optionIndex + customId
  menuItemId: string;
  name: Translation;
  selectedOptionLabel?: Translation;
  price: number;
  quantity: number;
  imageUrl?: string;
  customizationSelection?: DishCustomizationSelection;
  customizationSummary?: OrderItemCustomizationSummary;
}

export interface MenuItem {
  id: string;
  name: Translation;
  description: Translation;
  category: string;
  allergens: AllergenKey[];
  price: number; // base price or default price
  priceOptions?: PriceOption[]; // for small/large, cl-sizes for wine
  imageUrl: string;
  arModelUrl?: string; // .glb URL for Android / Web 3D
  arModelUsdzUrl?: string; // .usdz URL for iOS AR Quick Look
  isAvailable?: boolean; // default true. If false, item is sold out / out of stock
  unavailableReason?: Translation; // optional explanation e.g. "Raaka-aine loppu tältä päivältä"
  customization?: DishCustomization;
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  loginTime: string;
}

export interface Review {
  id: string;
  menuItemId: string;
  rating: number;
  author: string;
  comment: string;
  timestamp: string;
  language: 'fi' | 'en';
}

export interface Category {
  id: string;
  name: Translation;
  icon?: string;
}

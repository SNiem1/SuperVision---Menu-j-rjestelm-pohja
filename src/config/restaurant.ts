import { RestaurantConfig } from '../types';

export const restaurantConfig: RestaurantConfig = {
  slug: 'ravintola-menu',
  name: 'Ravintola',
  tagline: {
    fi: 'Digitaalinen menu & ruokatilaus',
    en: 'Digital Menu & Dining Order',
  },
  description: {
    fi: 'Monipuolinen ja selkeä ruokalista. Tarjoilemme laadukkaita klassikkoannoksia, raikkaita salaatteja, keittoja, burgereita ja herkullisia jälkiruokia jokaiseen makuun ja erikoisruokavalioon.',
    en: 'A versatile and clear dining menu. We serve quality classic dishes, fresh salads, soups, burgers, and delightful desserts crafted for every taste and dietary preference.',
  },
  address: 'Keskuskatu 10',
  city: 'Helsinki',
  postalCode: '00100',
  phone: '+358 10 123 4567',
  email: 'info@ravintolamenu.fi',
  openingHours: [
    {
      dayRange: { fi: 'Ma - To', en: 'Mon - Thu' },
      hours: '11:00 - 22:00',
    },
    {
      dayRange: { fi: 'Pe - La', en: 'Fri - Sat' },
      hours: '11:00 - 23:00',
    },
    {
      dayRange: { fi: 'Su', en: 'Sun' },
      hours: '12:00 - 21:00',
    },
  ],
  logoUrl: '',
  faviconUrl: '',
  brandColors: {
    blue: '#1b3b32',
    gold: '#d97736',
    goldText: '#a04a18',
    cream: '#f6f4ee',
    ink: '#171b18',
  },
  legal: {
    entityName: 'Ravintola Oy',
    businessId: '1234567-8',
  },
  currency: '€',
  locale: 'fi-FI',
  categories: [
    { id: 'alkuruoat', name: { fi: 'Alkuruoat', en: 'Appetizers' } },
    { id: 'salaatit', name: { fi: 'Salaatit', en: 'Salads' } },
    { id: 'keitot', name: { fi: 'Keitot', en: 'Soups' } },
    { id: 'paaruoat', name: { fi: 'Pääruoat', en: 'Mains' } },
    { id: 'pastat', name: { fi: 'Pastat & Kasvis', en: 'Pasta & Vegetarian' } },
    { id: 'burgerit', name: { fi: 'Hampurilaiset & Leivät', en: 'Burgers & Sandwiches' } },
    { id: 'jalkiruoat', name: { fi: 'Jälkiruoat', en: 'Desserts' } },
    { id: 'juomat', name: { fi: 'Juomat', en: 'Beverages' } },
    { id: 'viinit', name: { fi: 'Viinit', en: 'Wines' } },
  ],
};


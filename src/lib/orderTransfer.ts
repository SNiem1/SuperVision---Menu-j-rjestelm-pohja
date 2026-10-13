import { OrderItem, DishCustomizationSelection } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import {
  calculateCustomizationPrice,
  buildCustomizationSummary,
  generateCustomizedOrderItemId,
} from '../data/customizations';

export interface CompactOrderItem {
  i: string; // menuItemId
  q: number; // quantity
  o?: number; // selectedOptionIndex
  c?: DishCustomizationSelection; // customizations
}

/**
 * Encodes order items into a URL string containing the order payload in the hash fragment.
 */
export function encodeOrderToUrl(orderItems: OrderItem[]): string {
  const compactItems: CompactOrderItem[] = orderItems.map((item) => {
    let o: number | undefined = undefined;
    const menuItem = MENU_ITEMS.find((m) => m.id === item.menuItemId);
    if (menuItem && menuItem.priceOptions && item.selectedOptionLabel) {
      const idx = menuItem.priceOptions.findIndex(
        (opt) => opt.label.fi === item.selectedOptionLabel?.fi
      );
      if (idx !== -1) o = idx;
    }
    return {
      i: item.menuItemId,
      q: item.quantity,
      ...(o !== undefined ? { o } : {}),
      ...(item.customizationSelection ? { c: item.customizationSelection } : {}),
    };
  });

  const jsonStr = JSON.stringify(compactItems);
  const base64Str = btoa(encodeURIComponent(jsonStr));

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}#order=${base64Str}`;
}

/**
 * Decodes a raw payload string (URL, base64 or JSON) back into OrderItem array.
 */
export function decodeOrderPayload(rawPayload: string): OrderItem[] | null {
  try {
    let jsonStr = rawPayload.trim();
    if (jsonStr.includes('order=')) {
      jsonStr = jsonStr.split('order=')[1];
    }
    if (jsonStr.includes('&')) {
      jsonStr = jsonStr.split('&')[0];
    }

    try {
      jsonStr = decodeURIComponent(atob(jsonStr));
    } catch {
      try {
        jsonStr = decodeURIComponent(jsonStr);
      } catch {
        // use original string if not encoded
      }
    }

    const compactItems: CompactOrderItem[] = JSON.parse(jsonStr);
    if (!Array.isArray(compactItems)) return null;

    const restoredItems: OrderItem[] = [];

    for (const cItem of compactItems) {
      if (!cItem.i || typeof cItem.q !== 'number' || cItem.q <= 0) continue;
      const menuItem = MENU_ITEMS.find((m) => m.id === cItem.i);
      if (!menuItem) continue;

      let optionIndex: number | undefined = undefined;
      let price = menuItem.price;
      let selectedOptionLabel = undefined;

      if (
        typeof cItem.o === 'number' &&
        menuItem.priceOptions &&
        menuItem.priceOptions[cItem.o]
      ) {
        optionIndex = cItem.o;
        const option = menuItem.priceOptions[cItem.o];
        price = option.value;
        selectedOptionLabel = option.label;
      }

      if (cItem.c) {
        price = calculateCustomizationPrice(price, menuItem, cItem.c);
      }

      const id = generateCustomizedOrderItemId(menuItem.id, optionIndex, cItem.c);
      const customizationSummary = cItem.c
        ? buildCustomizationSummary(menuItem, cItem.c)
        : undefined;

      restoredItems.push({
        id,
        menuItemId: menuItem.id,
        name: menuItem.name,
        selectedOptionLabel,
        price,
        quantity: cItem.q,
        imageUrl: menuItem.imageUrl,
        customizationSelection: cItem.c,
        customizationSummary,
      });
    }

    return restoredItems.length > 0 ? restoredItems : null;
  } catch (err) {
    console.error('Failed to parse order payload:', err);
    return null;
  }
}

/**
 * Check if current URL contains an imported order payload in the hash or query.
 */
export function checkForImportedOrderFromUrl(): OrderItem[] | null {
  const hash = window.location.hash;
  const search = window.location.search;

  if (hash && hash.includes('order=')) {
    return decodeOrderPayload(hash);
  }
  if (search && search.includes('order=')) {
    return decodeOrderPayload(search);
  }
  return null;
}

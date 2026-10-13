import { Review } from '../types';
import { PRE_SEEDED_REVIEWS } from '../data/menuData';

const STORAGE_KEY = 'restaurant_menu_reviews';

export interface RatingStats {
  average: number;
  count: number;
}

export interface ReviewsBackend {
  loadStats(): Promise<Record<string, RatingStats>>;
  loadItemReviews(menuItemId: string): Promise<Review[]>;
  save(review: Review): Promise<Review>;
  loadAll?(): Promise<Review[]>;
}

export function getInitialSeedReviews(): Review[] {
  const initialReviews: Review[] = [];
  let index = 0;
  for (const [menuItemId, reviewsList] of Object.entries(PRE_SEEDED_REVIEWS)) {
    reviewsList.forEach((r) => {
      // Add Finnish review
      initialReviews.push({
        id: `seeded_${menuItemId}_fi_${index++}`,
        menuItemId,
        rating: r.rating,
        author: r.author,
        comment: r.comment.fi,
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        language: 'fi',
      });
      // Add English review
      initialReviews.push({
        id: `seeded_${menuItemId}_en_${index++}`,
        menuItemId,
        rating: r.rating,
        author: r.author,
        comment: r.comment.en,
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        language: 'en',
      });
    });
  }
  return initialReviews;
}

export const localStorageBackend: ReviewsBackend = {
  async loadAll(): Promise<Review[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse reviews from localStorage', e);
      }
    }
    const initial = getInitialSeedReviews();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {
      console.error('Failed to write seed reviews to localStorage', e);
    }
    return initial;
  },

  async loadStats(): Promise<Record<string, RatingStats>> {
    const stored = localStorage.getItem(STORAGE_KEY);
    let allReviews: Review[] = [];
    if (stored) {
      try {
        allReviews = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse reviews from localStorage', e);
      }
    } else {
      allReviews = getInitialSeedReviews();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
      } catch (e) {
        console.error('Failed to write seed reviews to localStorage', e);
      }
    }

    const statsMap: Record<string, { sum: number; count: number }> = {};
    for (const r of allReviews) {
      if (!statsMap[r.menuItemId]) {
        statsMap[r.menuItemId] = { sum: 0, count: 0 };
      }
      statsMap[r.menuItemId].sum += r.rating;
      statsMap[r.menuItemId].count += 1;
    }

    const result: Record<string, RatingStats> = {};
    for (const [id, data] of Object.entries(statsMap)) {
      result[id] = {
        average: Math.round((data.sum / data.count) * 10) / 10,
        count: data.count,
      };
    }
    return result;
  },

  async loadItemReviews(menuItemId: string): Promise<Review[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    let allReviews: Review[] = [];
    if (stored) {
      try {
        allReviews = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse reviews from localStorage', e);
      }
    } else {
      allReviews = getInitialSeedReviews();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
      } catch (e) {
        console.error('Failed to write seed reviews to localStorage', e);
      }
    }

    return allReviews.filter((r) => r.menuItemId === menuItemId);
  },

  async save(review: Review): Promise<Review> {
    const stored = localStorage.getItem(STORAGE_KEY);
    let allReviews: Review[] = [];
    if (stored) {
      try {
        allReviews = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse reviews when saving', e);
      }
    } else {
      allReviews = getInitialSeedReviews();
    }

    const index = allReviews.findIndex((r) => r.id === review.id);
    if (index >= 0) {
      allReviews[index] = review;
    } else {
      allReviews.unshift(review);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
    } catch (e) {
      console.error('Failed to save review to localStorage', e);
    }
    return review;
  },
};

export const reviewsBackend: ReviewsBackend = localStorageBackend;

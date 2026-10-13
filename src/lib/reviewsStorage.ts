import { Review } from '../types';
import { reviewsBackend } from './reviewsBackend';

export function getMenuItemAverageRating(reviews: Review[]): { average: number; count: number } {
  if (!reviews || reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export async function getAllReviews(): Promise<Review[]> {
  if (reviewsBackend.loadAll) {
    return reviewsBackend.loadAll();
  }
  return [];
}

export async function saveReview(
  menuItemId: string,
  rating: number,
  author: string,
  comment: string,
  language: 'fi' | 'en'
): Promise<Review> {
  const newReview: Review = {
    id: crypto.randomUUID(),
    menuItemId,
    rating,
    author: author.trim() || (language === 'fi' ? 'Anonyymi' : 'Anonymous'),
    comment: comment.trim(),
    timestamp: new Date().toISOString(),
    language,
  };
  return reviewsBackend.save(newReview);
}

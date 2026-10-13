import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Review } from '../types';
import { reviewsBackend, RatingStats } from '../lib/reviewsBackend';

interface ReviewsContextType {
  reviewsByItem: Map<string, Review[]>;
  getStats: (menuItemId: string) => RatingStats;
  fetchItemReviews: (menuItemId: string) => Promise<Review[]>;
  isItemLoading: (menuItemId: string) => boolean;
  addReview: (
    menuItemId: string,
    rating: number,
    author: string,
    comment: string,
    language: 'fi' | 'en'
  ) => Promise<Review>;
  isLoadingStats: boolean;
  error: string | null;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Record<string, RatingStats>>({});
  const [reviewsByItem, setReviewsByItem] = useState<Map<string, Review[]>>(new Map());
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingStats(true);
    reviewsBackend
      .loadStats()
      .then((loadedStats) => {
        if (isMounted) {
          setStats(loadedStats);
          setIsLoadingStats(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load review stats:', err);
          setError(err instanceof Error ? err.message : 'Failed to load review stats');
          setIsLoadingStats(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchItemReviews = useCallback(
    async (menuItemId: string): Promise<Review[]> => {
      if (reviewsByItem.has(menuItemId)) {
        return reviewsByItem.get(menuItemId) || [];
      }

      setLoadingItems((prev) => new Set(prev).add(menuItemId));

      try {
        const itemReviews = await reviewsBackend.loadItemReviews(menuItemId);
        setReviewsByItem((prev) => {
          const next = new Map(prev);
          next.set(menuItemId, itemReviews);
          return next;
        });

        if (itemReviews.length > 0) {
          const sum = itemReviews.reduce((acc, r) => acc + r.rating, 0);
          const avg = Math.round((sum / itemReviews.length) * 10) / 10;
          setStats((prev) => ({
            ...prev,
            [menuItemId]: { average: avg, count: itemReviews.length },
          }));
        }

        return itemReviews;
      } catch (err) {
        console.error(`Failed to load reviews for ${menuItemId}:`, err);
        return [];
      } finally {
        setLoadingItems((prev) => {
          const next = new Set(prev);
          next.delete(menuItemId);
          return next;
        });
      }
    },
    [reviewsByItem]
  );

  const isItemLoading = useCallback(
    (menuItemId: string) => loadingItems.has(menuItemId),
    [loadingItems]
  );

  const getStats = useCallback(
    (menuItemId: string): RatingStats => {
      const itemStats = stats[menuItemId];
      if (!itemStats) {
        return { average: 0, count: 0 };
      }
      return itemStats;
    },
    [stats]
  );

  const addReview = useCallback(
    async (
      menuItemId: string,
      rating: number,
      author: string,
      comment: string,
      language: 'fi' | 'en'
    ): Promise<Review> => {
      const newReview: Review = {
        id: crypto.randomUUID(),
        menuItemId,
        rating,
        author: author.trim() || (language === 'fi' ? 'Anonyymi' : 'Anonymous'),
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
        language,
      };

      setReviewsByItem((prev) => {
        const next = new Map(prev);
        const existing = next.get(menuItemId) || [];
        next.set(menuItemId, [newReview, ...existing]);
        return next;
      });

      setStats((prev) => {
        const current = prev[menuItemId] || { average: 0, count: 0 };
        const newCount = current.count + 1;
        const currentSum = current.average * current.count;
        const newAvg = Math.round(((currentSum + rating) / newCount) * 10) / 10;
        return {
          ...prev,
          [menuItemId]: { average: newAvg, count: newCount },
        };
      });

      try {
        await reviewsBackend.save(newReview);
      } catch (err) {
        console.error('Failed to persist review:', err);
      }

      return newReview;
    },
    []
  );

  const value = useMemo(
    () => ({
      reviewsByItem,
      getStats,
      fetchItemReviews,
      isItemLoading,
      addReview,
      isLoadingStats,
      error,
    }),
    [reviewsByItem, getStats, fetchItemReviews, isItemLoading, addReview, isLoadingStats, error]
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}

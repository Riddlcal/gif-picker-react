import React, { useContext, useEffect, useState } from 'react';
import TenorContext from '../../context/TenorContext';
import { TenorResult } from '../../managers/TenorManager';
import GifList from './GifList';

export interface TrendingResultProps {
  columnsCount: number;
}

function TrendingResult({ columnsCount }: TrendingResultProps) {
  const [trendingResult, setTrendingResult] = useState<TenorResult | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [nextPos, setNextPos] = useState<string | undefined>(undefined);

  const tenor = useContext(TenorContext);

  // Load initial trending results
  useEffect(() => {
    setLoading(true);
    async function fetchTrending(): Promise<void> {
      const result = await tenor.trending(50); // Fetch first 50
      setTrendingResult(result);
      setNextPos(result.next); // Save the next position for further requests
      setLoading(false);
    }
    fetchTrending();
  }, []);

  // Load more results when triggered
  const loadMore = async () => {
    if (!nextPos) return; // No more results to load
    setLoading(true);
    const result = await tenor.trending(50, nextPos); // Fetch the next 50
    setTrendingResult((prev) => ({
      next: result.next,
      images: [...(prev?.images || []), ...result.images],
    }));
    setNextPos(result.next); // Update the next position
    setLoading(false);
  };

  return (
    <>
      <GifList
        isLoading={isLoading}
        columnsCount={columnsCount}
        result={trendingResult}
      />
      {nextPos && (
        <button
          onClick={loadMore}
          className="load-more-button"
          disabled={isLoading}
        >
          Load More GIFs
        </button>
      )}
    </>
  );
}

export default TrendingResult;

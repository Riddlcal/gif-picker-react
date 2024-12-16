import React, { useContext, useEffect, useState } from 'react';
import TenorContext from '../../context/TenorContext';
import { TenorResult } from '../../managers/TenorManager';
import GifList from './GifList';

export interface SearchResultProps {
  searchTerm: string;
  columnsCount: number;
}

function SearchResult({ searchTerm, columnsCount }: SearchResultProps) {
  const [searchResult, setSearchResult] = useState<TenorResult | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [nextPos, setNextPos] = useState<string | undefined>(undefined);

  const tenor = useContext(TenorContext);

  // Load initial search results
  useEffect(() => {
    setLoading(true);
    async function search(): Promise<void> {
      const result = await tenor.search(searchTerm, 50); // Fetch first 50
      setSearchResult(result);
      setNextPos(result.next); // Save the next position for further requests
      setLoading(false);
    }
    const debounce = setTimeout(() => search(), 800);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Load more results when triggered
  const loadMore = async () => {
    if (!nextPos) return; // No more results to load
    setLoading(true);
    const result = await tenor.search(searchTerm, 50, nextPos); // Fetch the next 50
    setSearchResult((prev) => ({
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
        result={searchResult}
        searchTerm={searchTerm}
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

export default SearchResult;

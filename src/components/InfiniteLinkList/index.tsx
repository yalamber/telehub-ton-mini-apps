'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Spinner } from '@telegram-apps/telegram-ui';
import LinkDisplay from '../LinkDisplay';

interface Link {
  _id: string;
  // Add other link properties here
}

export default function InfiniteLinkList({
  initialLinks,
  initialNextCursor,
}: {
  initialLinks: Link[];
  initialNextCursor?: string | null;
}) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/links?cursor=${nextCursor}&limit=10`);
      const data = await response.json();
      if (data.status === 'success') {
        setLinks((prevLinks) => [...prevLinks, ...data.data]);
        setNextCursor(data.pagination.nextCursor);
      } else {
        console.error('Failed to fetch more links:', data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor, isLoading]);
  const scrollTrigger = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 }
    );

    const currentTrigger = scrollTrigger.current;
    if (currentTrigger) observer.observe(currentTrigger);

    return () => {
      if (currentTrigger) observer.unobserve(currentTrigger);
    };
  }, [loadMore]);

  return (
    <div>
      {links.map((item: Link) => (
        <div className="pb-4" key={item._id}>
          <LinkDisplay item={item} />
        </div>
      ))}
      <div className="p-4">
        {nextCursor && (
          <div ref={scrollTrigger} className="flex justify-center">
            {isLoading ? <Spinner size="m" /> : null}
          </div>
        )}
      </div>
    </div>
  );
}

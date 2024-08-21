'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Spinner } from '@telegram-apps/telegram-ui';
import LinkDisplay from '../LinkDisplay';

export default function InfiniteLinkList({
  initialLinks,
  initialNextCursor,
}: {
  initialLinks: Array<any>;
  initialNextCursor?: string | null;
}) {
  const [links, setLinks] = useState(initialLinks);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);

    (async () => {
      const response = await fetch(`/api/links?cursor=${nextCursor}&limit=10`);
      const data = await response.json();
      if (data.status === 'success') {
        setLinks((prevLinks) => [...prevLinks, ...data.data]);
        setNextCursor(data.pagination.nextCursor);
      } else {
        console.error('Failed to fetch more links:', data);
      }
    })();
  }, [nextCursor, isLoading]);
  const scrollTrigger = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
    if (scrollTrigger.current) {
      observer.observe(scrollTrigger.current);
    }
    // Cleanup
    return () => {
      if (scrollTrigger.current) {
        observer.unobserve(scrollTrigger.current);
      }
    };
  }, [loadMore]);

  return (
    <div>
      {links.map((item: any) => (
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

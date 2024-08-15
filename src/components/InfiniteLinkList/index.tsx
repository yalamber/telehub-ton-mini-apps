'use client';
import { useEffect, useState, useRef } from 'react';
import LinkDisplay from '../LinkDisplay';
import { Spinner } from '@telegram-apps/telegram-ui';

export default function InfiniteLinkList({
  initialLinks,
}: {
  initialLinks: Array<any>;
}) {
  const [links, setLinks] = useState(initialLinks);
  const [hasMoreData, setHasMoreData] = useState(true);
  const loadMore = async () => {
    if (hasMoreData) {
      //TODO: api call
      const apiLinks: Array<any> = [];

      if (apiLinks.length == 0) {
        setHasMoreData(false);
      }
      setLinks((prevLinks) => [...prevLinks, ...apiLinks]);
    }

    console.log('Load more called');
  };
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
  }, [hasMoreData]);

  return (
    <div>
      {links.map((item: any) => (
        <LinkDisplay key={item._id} item={item} />
      ))}
      <div className="p-4">
        {hasMoreData && (
          <div ref={scrollTrigger}>
            <Spinner size="m" />
          </div>
        )}
      </div>
    </div>
  );
}

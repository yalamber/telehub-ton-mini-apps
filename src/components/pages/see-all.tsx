'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackButton, useMainButton } from '@telegram-apps/sdk-react';
import { Section, Spinner } from '@telegram-apps/telegram-ui';
import { useFirstRender } from '@/hooks/useFirstRender';
import InfiniteLinkList from '@/components/InfiniteLinkList';

interface HomeProps {
  resLinks: Array<any>;
  type: 'NEW' | 'NONE' | 'TRENDING';
}

export default function SeeAll({ resLinks, type }: HomeProps) {
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  const router = useRouter();
  const firstRender = useFirstRender();
  const [contentLoading, setContentLoading] = useState(false);
  const [links, setLinks] = useState(resLinks ?? []);

  useEffect(() => {
    if (bb) {
      bb.show();
      bb.on('click', () => {
        // go back
        router.back();
      });
    }
    if (mb) {
      mb.hide();
    }
  }, [bb, mb, router]);

  const fetchFilteredLinks = async ({
    type,
    setLinks,
  }: {
    type: string;
    setLinks: any;
  }) => {
    const queryParams = new URLSearchParams();
    // if (params?.debouncedSearchTerm)
    //   queryParams.append('title', params.debouncedSearchTerm);
    // if (params?.activeCategory)
    //   queryParams.append('category', params.activeCategory);
    // if (params?.activeCountry)
    //   queryParams.append('country', params.activeCountry);
    // if (params?.activeCity) queryParams.append('city', params.activeCity);
    // if (params?.activeLanguage)
    //   queryParams.append('language', params.activeLanguage);
    if (type) queryParams.append('featuredType', type);
    const response = await fetch(`/api/links?${queryParams}`);
    const resData = await response.json();
    const links = resData?.data;
    console.log(links);
    setLinks(links);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setContentLoading(true);
        await Promise.all([
          fetchFilteredLinks({
            type,
            setLinks: setLinks,
          }),
        ]);
        // TODO get all links below and also add pagination
      } catch (e) {
        console.log(e);
        // TODO: add visual feedback or snackbar for error
      } finally {
        setContentLoading(false);
      }
    };
    if (!firstRender) {
      fetchData();
    }
  }, []);

  return (
    <div>
      <h1 className="font-bold px-5 pt-2">
        {type === 'TRENDING' ? 'Trending' : 'New'} Links
      </h1>
      {contentLoading && (
        <div className="flex justify-center">
          <Spinner size="m" />
        </div>
      )}
      {links?.length > 0 && (
        <div className="px-5 py-5">
          <InfiniteLinkList initialLinks={links} />
        </div>
      )}
    </div>
  );
}

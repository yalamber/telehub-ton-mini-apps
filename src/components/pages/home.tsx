'use client';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import {
  useBackButton,
  useMainButton,
  useViewport,
  useThemeParams,
} from '@telegram-apps/sdk-react';
import {
  FixedLayout,
  Spinner,
} from '@telegram-apps/telegram-ui';
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle';
import LinkDisplay from '@/components/LinkDisplay';
import FilterSelector from '@/components/FilterSelector';
import { Link } from '@/components/Link';
import { fetchCities } from '@/utils/helpers';
import { useFirstRender } from '@/hooks/useFirstRender';
import InfiniteLinkList from '@/components/InfiniteLinkList';

interface HomeProps {
  countries: Array<any>;
  languages: Array<any>;
  categories: Array<any>;
  resTrendingLinks: Array<any>;
  resNewLinks: Array<any>;
  resLinks: Array<any>;
  nextCursor: string;
}

export default function Home({
  countries,
  languages,
  categories,
  resTrendingLinks,
  resNewLinks,
  resLinks,
  nextCursor,
}: HomeProps) {
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  const vp = useViewport();
  const themeParams = useThemeParams();
  const firstRender = useFirstRender();
  const [searchTerm, setSearchTerm] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [trendingLinks, setTrendingLinks] = useState(resTrendingLinks ?? []);
  const [newLinks, setNewLinks] = useState(resNewLinks ?? []);
  const [links, setLinks] = useState(resLinks ?? []);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<any>>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (bb) {
      bb.hide();
    }
    if (mb) {
      mb.hide();
    }
    if (vp?.expand) {
      vp?.expand();
    }
  }, [bb, mb, vp]);

  // set cities if active country changed
  useEffect(() => {
    const fetchAndSetCities = async () => {
      if (activeCountry) {
        const data = await fetchCities(activeCountry);
        setCities(data);
        setActiveCity(null);
      }
    };
    fetchAndSetCities();
  }, [activeCountry]);

  const fetchFilteredLinks = async ({
    params,
    type,
    setLinks,
  }: {
    params: any;
    type: string;
    setLinks: any;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.debouncedSearchTerm)
      queryParams.append('title', params.debouncedSearchTerm);
    if (params?.activeCategory)
      queryParams.append('category', params.activeCategory);
    if (params?.activeCountry)
      queryParams.append('country', params.activeCountry);
    if (params?.activeCity) queryParams.append('city', params.activeCity);
    if (params?.activeLanguage)
      queryParams.append('language', params.activeLanguage);
    if (type) queryParams.append('featuredType', type);
    const response = await fetch(`/api/links?${queryParams}`);
    const resData = await response.json();
    const links = resData?.data;
    setLinks(links);
  };

  useEffect(() => {
    const params = {
      debouncedSearchTerm,
      activeCategory,
      activeCountry,
      activeCity,
      activeLanguage,
    };

    const fetchData = async () => {
      try {
        setContentLoading(true);
        await Promise.all([
          fetchFilteredLinks({
            params,
            type: 'TRENDING',
            setLinks: setTrendingLinks,
          }),
          fetchFilteredLinks({
            params,
            type: 'NEW',
            setLinks: setNewLinks,
          }),
          fetchFilteredLinks({
            params,
            type: 'NONE',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearchTerm,
    activeCategory,
    activeCountry,
    activeCity,
    activeLanguage,
  ]);

  const LinkListDisplay = ({
    links,
    fullWidth = false,
  }: {
    links: Array<any>;
    fullWidth?: boolean;
  }) => {
    const wrapperDivWidth =
      fullWidth || links?.length === 1
        ? 'w-full'
        : `grid grid-rows-2 grid-flow-col auto-cols-max flex items-center`;
    const innerDivWidth =
      fullWidth || links?.length === 1 ? 'w-full' : 'w-64 pr-5';
    return (
      <ul className={`${wrapperDivWidth}`}>
        {links.map((item: any) => {
          return (
            <li
              key={`link-${item._id}`}
              className={`py-3 sm:pb-4 ${innerDivWidth}`}
            >
              <LinkDisplay item={item} />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <FixedLayout
        vertical="top"
        style={{
          padding: 0,
          background: themeParams.secondaryBgColor,
        }}
        className={`z-10`}
      >
        <div className="flex m-4">
          <input
            type="text"
            className={`p-2 mr-4 flex-grow rounded-xl bg-transparent border border-[${themeParams.accentTextColor}]`}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link href="/add-link" className="self-center">
            <Icon28AddCircle />
          </Link>
        </div>
        <div className="grid grid-flow-col space-x-2 m-4 justify-stretch overflow-x-auto no-scrollbar">
          <FilterSelector
            triggerClass="min-w-[125px]"
            modalContainerStyle={{
              background: themeParams.bgColor,
            }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            }
            items={countries}
            label={activeCountry ?? 'Countries'}
            onChange={setActiveCountry}
          />
          <FilterSelector
            modalContainerStyle={{
              background: themeParams.bgColor,
            }}
            triggerClass="min-w-[90px]"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="size-6"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"></path>
              </svg>
            }
            disabled={!activeCountry}
            items={cities}
            label={activeCity ?? 'City'}
            onChange={setActiveCity}
          />
          <FilterSelector
            triggerClass="min-w-[130px]"
            modalContainerStyle={{
              background: themeParams.bgColor,
            }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                />
              </svg>
            }
            items={languages}
            label={activeLanguage ?? 'Language'}
            onChange={setActiveLanguage}
          />
          <FilterSelector
            triggerClass="min-w-[140px]"
            modalContainerStyle={{
              background: themeParams.bgColor,
            }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6Z"
                />
              </svg>
            }
            items={categories}
            label={activeCategory ?? 'Categories'}
            onChange={setActiveCategory}
          />
        </div>
      </FixedLayout>
      <div className="mt-32 bg-none bg-transparent">
        {contentLoading && (
          <div className="flex justify-center">
            <Spinner size="m" />
          </div>
        )}
        {trendingLinks?.length > 0 && (
          <>
            <div className="flex justify-between px-4 py-2">
              <Link href="/see-all/trending">
                <h2 className="font-bold">Trending</h2>
              </Link>
              <Link href="/see-all/trending">See all</Link>
            </div>
            <div className="px-5 pb-4 overflow-auto hover:overflow-scroll no-scrollbar">
              <LinkListDisplay links={trendingLinks} />
            </div>
          </>
        )}
        {newLinks?.length > 0 && (
          <>
            <div className="flex justify-between px-4 py-2">
              <Link href="/see-all/new">
                <h2 className="font-bold">New</h2>
              </Link>
              <Link href="/see-all/new">See all</Link>
            </div>
            <div className="px-5 pb-4 overflow-auto hover:overflow-scroll no-scrollbar">
              <LinkListDisplay links={newLinks} />
            </div>
          </>
        )}
        {links?.length > 0 && (
          <>
            <div className="flex justify-between px-4 py-2">
              <h2 className="font-bold">Links</h2>
            </div>
            <div className="px-5 py-2">
              <InfiniteLinkList
                initialLinks={links}
                initialNextCursor={nextCursor}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

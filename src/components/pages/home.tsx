'use client';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import {
  useBackButton,
  useMainButton,
  useViewport,
  useUtils,
  useThemeParams,
} from '@telegram-apps/sdk-react';

import { Section, FixedLayout, Avatar } from '@telegram-apps/telegram-ui';
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle';
import FilterSelector from '@/components/FilterSelector/FilterSelector';
import { Link } from '@/components/Link/Link';
import { fetchCities } from '@/utils/helpers';

interface HomeProps {
  countries: Array<any>;
  languages: Array<any>;
  categories: Array<any>;
  links: Array<any>;
}

export default function Home({
  countries,
  languages,
  categories,
  links,
}: HomeProps) {
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  const vp = useViewport();
  const utils = useUtils();
  const themeParams = useThemeParams();
  const [searchTerm, setSearchTerm] = useState('');
  // const [filteredLinks, setFilteredLinks] = useState(links ?? []);
  const [trendingLinks, setTrendingLinks] = useState([]);
  const [newLinks, setNewLinks] = useState([]);
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
  }, [bb]);

  useEffect(() => {
    if (mb) {
      mb.hide();
    }
  }, [mb]);

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
      await fetchFilteredLinks({
        params,
        type: 'TRENDING',
        setLinks: setTrendingLinks,
      });
      await fetchFilteredLinks({ params, type: 'NEW', setLinks: setNewLinks });
    };

    fetchData();
  }, [
    debouncedSearchTerm,
    activeCategory,
    activeCountry,
    activeCity,
    activeLanguage,
  ]);

  useEffect(() => {
    if (vp?.expand) {
      vp?.expand();
    }
  }, [vp]);
  console.log(
    'themeParams',
    themeParams.bgColor,
    `bg-[${themeParams.bgColor}]`
  );
  return (
    <>
      <FixedLayout
        vertical="top"
        style={{
          padding: 0,
        }}
        className={`z-10 bg-[${themeParams.bgColor}]`}
      >
        <div className="flex m-4">
          <input
            type="text"
            className="p-2 mr-2 flex-grow rounded-xl bg-transparent border border-blue-400"
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
                  d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
                />
              </svg>
            }
            items={countries}
            label={activeCountry ?? 'Countries'}
            onChange={setActiveCountry}
          />
          <FilterSelector
            triggerClass="min-w-[90px]"
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
            disabled={!activeCountry}
            items={cities}
            label={activeCity ?? 'City'}
            onChange={setActiveCity}
          />
          <FilterSelector
            triggerClass="min-w-[130px]"
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
      <Section className="mt-32">
        {trendingLinks?.length > 0 && (
          <Section header="Trending">
            <div className="px-5 overflow-auto hover:overflow-scroll no-scrollbar">
              <ul
                className={`grid gap-x-6 grid-cols-2 ${
                  trendingLinks?.length > 1 && 'w-[50rem]'
                }`}
              >
                {trendingLinks.map((item: any, index: number) => {
                  return (
                    <li
                      key={`new-link-${index}`}
                      className="py-3 sm:pb-4  w-[25rem]"
                    >
                      <a
                        key={`link-${index}`}
                        href={`https://t.me/${item.link}`}
                        onClick={(e) => {
                          e.preventDefault();
                          utils.openTelegramLink(`https://t.me/${item.link}`);
                        }}
                      >
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                            <Avatar
                              size={40}
                              src={item.photo ?? ''}
                              acronym={item.title.slice(0, 1)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {item.memberCount} members
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base text-gray-900 dark:text-white">
                            <span className="text-xs font-medium me-2 px-2.5 py-1 rounded-full dark:bg-gray-700 dark:text-white">
                              Open
                            </span>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
              {/* {trendingLinks?.length === 0 && <Cell>No Results</Cell>} */}
            </div>
          </Section>
        )}
        {newLinks?.length > 0 && (
          <Section header="New">
            <div className="px-5 overflow-auto hover:overflow-scroll no-scrollbar">
              <ul
                className={`grid gap-x-6 grid-cols-2 ${
                  newLinks?.length > 1 && 'w-[50rem]'
                }`}
              >
                {newLinks.map((item: any, index: number) => {
                  return (
                    <li
                      key={`new-link-${index}`}
                      className="py-3 sm:pb-4  w-[25rem]"
                    >
                      <a
                        key={`link-${index}`}
                        href={`https://t.me/${item.link}`}
                        onClick={(e) => {
                          e.preventDefault();
                          utils.openTelegramLink(`https://t.me/${item.link}`);
                        }}
                      >
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="flex-shrink-0">
                            <Avatar
                              size={40}
                              src={item.photo ?? ''}
                              acronym={item.title.slice(0, 1)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {item.memberCount} members
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base text-gray-900 dark:text-white">
                            <span className="text-xs font-medium me-2 px-2.5 py-1 rounded-full dark:bg-gray-700 dark:text-white">
                              Open
                            </span>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
              {/* {newLinks?.length === 0 && <Cell>No Results</Cell>} */}
            </div>
          </Section>
        )}
      </Section>
    </>
  );
}

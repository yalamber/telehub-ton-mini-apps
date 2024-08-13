'use client';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import {
  useBackButton,
  useMainButton,
  useViewport,
} from '@telegram-apps/sdk-react';

import {
  Section,
  FixedLayout,
  Avatar,
  Button,
  Cell,
} from '@telegram-apps/telegram-ui';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLinks, setFilteredLinks] = useState(links ?? []);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<any>>([]);
  const vp = useViewport();

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
      }
    };
    fetchAndSetCities();
  }, [activeCountry]);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (debouncedSearchTerm) queryParams.append('title', debouncedSearchTerm);
    if (activeCategory) queryParams.append('category', activeCategory);
    if (activeCountry) queryParams.append('country', activeCountry);
    if (activeCity) queryParams.append('city', activeCity);
    if (activeLanguage) queryParams.append('language', activeLanguage);

    const filterLinks = async () => {
      const response = await fetch(`/api/filter-links?${queryParams}`);
      const resData = await response.json();
      const links = resData?.data;
      setFilteredLinks(links);
    };

    filterLinks();
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

  return (
    <>
      <FixedLayout
        vertical="top"
        style={{
          padding: 0,
        }}
        className="bg-slate-900 z-10"
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
        <div className="grid grid-flow-col space-x-2 m-4 justify-stretch overflow-x-auto">
          <FilterSelector
            items={categories}
            label={activeCategory ?? 'Categories'}
            onChange={setActiveCategory}
          />
          <FilterSelector
            items={countries}
            label={activeCountry ?? 'Countries'}
            onChange={setActiveCountry}
          />
          <FilterSelector
            disabled={!activeCountry}
            items={cities}
            label={activeCity ?? 'City'}
            onChange={setActiveCity}
          />
          <FilterSelector
            items={languages}
            label={activeLanguage ?? 'Language'}
            onChange={setActiveLanguage}
          />
        </div>
      </FixedLayout>
      <Section className="mt-32">
        <Section header="#Channels">
          {filteredLinks?.length > 0 &&
            filteredLinks.map((item: any, index: number) => (
              <Link key={`link-${index}`} href={`https://t.me/${item.link}`}>
                <Cell
                  before={
                    <Avatar
                      size={40}
                      src={item.photo ?? ''}
                      acronym={item.title.slice(0, 1)}
                    />
                  }
                >
                  {item.title}
                </Cell>
              </Link>
            ))}
          {filteredLinks?.length === 0 && <Cell>No Results</Cell>}
        </Section>
      </Section>
    </>
  );
}

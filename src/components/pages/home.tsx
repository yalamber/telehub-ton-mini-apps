'use client';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useBackButton, useMainButton } from '@telegram-apps/sdk-react';
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
  const [cities, setCities] = useState([]);

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
    // TODO: query cities of specific country with api
    // setCities(data);
  }, [activeCountry]);

  useEffect(() => {
    // TODO: Query Links and update links
  }, [
    debouncedSearchTerm,
    activeCategory,
    activeCountry,
    activeCity,
    activeLanguage,
  ]);
  return (
    <>
      <FixedLayout
        vertical="top"
        style={{
          padding: 0,
        }}
        className="bg-slate-800"
      >
        <div className="flex m-4">
          <input
            type="text"
            className="p-2 mr-2 flex-grow rounded bg-transparent border border-blue-400"
            placeholder="Search"
          />
          <Link href="/add-link">
            <Button mode="filled" before={<Icon28AddCircle />}>
              Add Link
            </Button>
          </Link>
        </div>
        <div className="grid grid-flow-col space-x-2 m-4 justify-stretch">
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
        <Section header="Link header text here">
          {filteredLinks.map((item: any) => (
            <Link href={`https://t.me/${item.link}`}>
              <Cell
                before={
                  <Avatar
                    size={40}
                    src="https://avatars.githubusercontent.com/u/84640980?v=4"
                  />
                }
              >
                {item.title}
              </Cell>
            </Link>
          ))}
        </Section>
      </Section>
    </>
  );
}

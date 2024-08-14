"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
  useBackButton,
  useMainButton,
  useViewport,
  useUtils,
} from "@telegram-apps/sdk-react";

import { Section, FixedLayout, Avatar, Cell } from "@telegram-apps/telegram-ui";
import { Icon28AddCircle } from "@telegram-apps/telegram-ui/dist/icons/28/add_circle";
import FilterSelector from "@/components/FilterSelector/FilterSelector";
import { Link } from "@/components/Link/Link";
import { fetchCities } from "@/utils/helpers";

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
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredLinks, setFilteredLinks] = useState(links ?? []);
  const [trendingLinks, setTrendingLinks] = useState(links ?? []);
  const [newLinks, setNewLinks] = useState(links ?? []);
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

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (debouncedSearchTerm) queryParams.append("title", debouncedSearchTerm);
    if (activeCategory) queryParams.append("category", activeCategory);
    if (activeCountry) queryParams.append("country", activeCountry);
    if (activeCity) queryParams.append("city", activeCity);
    if (activeLanguage) queryParams.append("language", activeLanguage);

    const filterLinks = async () => {
      const response = await fetch(`/api/links?${queryParams}`);
      const resData = await response.json();
      const links = resData?.data;
      const trendingLinks = links.filter(
        (item: any) => item.featuredType === "TRENDING"
      );
      const newLinks = links.filter(
        (item: any) => item.featuredType === "NEW"
      );
      setTrendingLinks(trendingLinks);
      setNewLinks(newLinks);
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
          <div className="flex flex-col">
            <FilterSelector
              items={categories}
              label={activeCategory ?? "Categories"}
              onChange={setActiveCategory}
            />
          </div>
          <FilterSelector
            items={countries}
            label={activeCountry ?? "Countries"}
            onChange={setActiveCountry}
          />
          <FilterSelector
            disabled={!activeCountry}
            items={cities}
            label={activeCity ?? "City"}
            onChange={setActiveCity}
          />
          <FilterSelector
            items={languages}
            label={activeLanguage ?? "Language"}
            onChange={setActiveLanguage}
          />
        </div>
      </FixedLayout>
      <Section className="mt-32">
      {trendingLinks?.length > 0 && (
          <Section header="Trending">
            <div className="px-5">
              <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                {trendingLinks.map((item: any, index: number) => {
                  return (
                    <li key={`new-link-${index}`} className="py-3 sm:pb-4">
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
                              src={item.photo ?? ""}
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
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                              Group
                            </span>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>

              {trendingLinks?.length === 0 && <Cell>No Results</Cell>}
            </div>
          </Section>
        )}
        {newLinks?.length > 0 && (
          <Section header="New">
            <div className="px-5">
              <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                {newLinks.map((item: any, index: number) => {
                  return (
                    <li key={`new-link-${index}`} className="py-3 sm:pb-4">
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
                              src={item.photo ?? ""}
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
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                              Group
                            </span>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>

              {newLinks?.length === 0 && <Cell>No Results</Cell>}
            </div>
          </Section>
        )}
      </Section>
    </>
  );
}

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
  const [trendingLinks, setTrendingLinks] = useState( []);
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


  const useFilteredLinks = async ({params, type, setLinks}:{params: any; type: string; setLinks: any}) => {
    const queryParams = new URLSearchParams();
    if (params?.debouncedSearchTerm) queryParams.append("title", params.debouncedSearchTerm);
    if (params?.activeCategory) queryParams.append("category", params.activeCategory);
    if (params?.activeCountry) queryParams.append("country", params.activeCountry);
    if (params?.activeCity) queryParams.append("city", params.activeCity);
    if (params?.activeLanguage) queryParams.append("language", params.activeLanguage);
    if (type) queryParams.append("featuredType", type);
    const response = await fetch(`/api/links?${queryParams}`);
    const resData = await response.json();
    const links = resData?.data;
    setLinks(links);
  }


  useEffect(() => {
    const params = {
      debouncedSearchTerm,
      activeCategory,
      activeCountry,
      activeCity,
      activeLanguage
    }
    const fetchData = async () => {
      await useFilteredLinks({ params, type: "TRENDING", setLinks: setTrendingLinks });
      await useFilteredLinks({ params, type: "NEW", setLinks: setNewLinks });
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
          <Section className="relative" header="Trending">
            {/* <div className="absolute top-4 right-3 cursor-pointer">View All</div> */}
            <div className="px-5 overflow-auto hover:overflow-scroll no-scrollbar">
              <ul className={`grid gap-x-6 grid-cols-2 ${trendingLinks?.length > 1 && "w-[50rem]"}`}>
                {trendingLinks.map((item: any, index: number) => {
                  return (
                    <li key={`new-link-${index}`} className="py-3 sm:pb-4  w-[25rem]">
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
              <ul className={`grid gap-x-6 grid-cols-2 ${newLinks?.length > 1 && "w-[50rem]"}`}>
                {newLinks.map((item: any, index: number) => {
                  return (
                    <li key={`new-link-${index}`} className="py-3 sm:pb-4  w-[25rem]">
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

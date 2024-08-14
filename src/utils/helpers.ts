export const fetchCities = async (country: string) => {
  let url = `/api/filter-options?type=CITY`;
  if (country) {
    url += `&parent=${country}`;
  }
  const response = await fetch(url);
  const resData = await response.json();
  const cities = resData?.data;
  return cities;
};

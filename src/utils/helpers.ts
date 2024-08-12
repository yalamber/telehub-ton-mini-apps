export const fetchCities = async (country: string) => {
    const response = await fetch(`/api/cities?country=${country}`);
    const resData = await response.json();
    const cities = resData?.data;
    return cities;
}
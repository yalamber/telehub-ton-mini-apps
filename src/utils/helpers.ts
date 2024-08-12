export const fetchCities = async (country: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities?country=${country}`);
    const resData = await response.json();
    const cities = resData?.data;
    return cities;
}
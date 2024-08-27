import dbConnect from '../utils/dbConnect.ts';
import categories from './data/category.json' with { type: "json" };
import languages from './data/language.json' with { type: "json" };
import countries from './data/countries.json' with { type: "json" };
import FilterOption from '../models/FilterOption.ts';

(async () => {
  await dbConnect();
  // const insertCats = categories.map((cat) => ({
  //   label: cat,
  //   value: cat,
  //   type: "CATEGORY"
  // }))
  // await FilterOption.insertMany(insertCats);

  // const insertLanguages = languages.map((cat) => ({
  //   label: cat,
  //   value: cat,
  //   type: "LANGUAGE"
  // }))
  // await FilterOption.insertMany(insertLanguages);
  // console.log('inserted language')

  for (const item of countries) {
    try {
      const insertCities = item.cities.map((city) => ({
          label: city,
          value: city,
          type: "CITY",
          parent: item.country
      }))
      await FilterOption.insertMany([{label: item.country, value: item.country, type: "COUNTRY"}, ...insertCities]);
      console.log('inserted countries')
    } catch (e) {
      console.log(e)
    }
  }
  console.log('inserted')
})();

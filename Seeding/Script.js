import City from "./Models/City.js";
import Country from "./Models/Country.js";
import mongoose from "mongoose";
import fs from "fs";
import es from "event-stream";
import JSONStream from "JSONStream";
mongoose
  .connect("mongodb://localhost:27017/CityDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const streamCity = fs.createReadStream(
  "/home/bonami/Desktop/Seeding/citiesData.json",
  { encoding: "utf8" }
);

const streamCountry = fs.createReadStream(
  "/home/bonami/Desktop/Seeding/Country Info.json",
  { encoding: "utf8" }
);

const processCountries = () => {
  return new Promise((resolve, reject) => {
    streamCountry
      .pipe(JSONStream.parse("*"))
      .pipe(
        es.mapSync(async (country) => {
          const countryData = {
            countryCode: country.country_code || "",
            countryName: country.country_name || "",
            costRating: country.cost_rating || 0,
            peakSeasonStart: country.peak_season_start || "",
            peakSeasonEnd: country.peak_season_end || "",
          };

          try {
            await Country.create(countryData);
            console.log("Inserted country:", countryData);
          } catch (err) {
            console.error("Error inserting country data:", err);
          }
        })
      )
  });
};

const processCities = () => {
  return new Promise((resolve, reject) => {
    streamCity.pipe(JSONStream.parse("*")).pipe(
      es.mapSync(async (city) => {
        // console.log("========== city ========", city)
        // return
        // const allCountries = await Country.find({});
        // console.log(allCountries);
        const contry = await Country.findOne({countryName: city.cou_name_en});
        if(!contry) {
          console.error("Country not found for city:", city.name);
          return; // Skip this city if the country is not found in the database.
        }
        const cityData = {
          cityName: city.name || "",
          alternateNames: city.alternate_names || [],
          countryNameEN: city.cou_name_en || "Not_Available",
          latitude: city.coordinates.lat || 0,
          longitude: city.coordinates.lon || 0,
          countryId: contry._id,
        };

        try {
          await City.create(cityData);
          console.log("Inserted city:", cityData);
        } catch (err) {
          console.error("Error inserting city data:", err);
        }
      })
    );
  });
};

const startProcessing = async () => {
  try {
    await Promise.all([processCountries(),processCities()]);
    mongoose.connection.close(); // Close the connection after all data is inserted
    console.log("All data processing complete");
  } catch (error) {
    console.error("Error during processing:", error);
  }
};
countryName
startProcessing();

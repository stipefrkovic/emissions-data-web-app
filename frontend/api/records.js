import apiCall from "./call.js";
import GeneralRecord from "../models/general.js";
import EmissionRecord from "../models/emission.js";
import EnergyRecord from "../models/energy.js";
import TempChangeRecord from "../models/temp-change.js";
import CountryRecord from "../models/country.js";
import SpecialRecord from "../models/special.js";

export default {
  /**
   * A function for posting a new general record.
   * @param {string} country 
   * @param {string} isoCode 
   * @param {number} year 
   * @param {number} GDP 
   * @param {number} population 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async postGeneralRecord(
    /** @type {string} */ country,
    /** @type {number} */ year,
    /** @type {number} */ gdp,
    /** @type {number} */ population,
    /** @type {string} */ content
  ) {
    const data = {};
    if (country !== undefined) data.country = country;
    if (year !== undefined) data.year = year;
    if (gdp !== undefined) data.gdp = gdp;
    if (population !== undefined) data.population = population;

    const apiResponse = await apiCall(`records/general`, "POST", data, content);
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return GeneralRecord.fromJson(await apiResponse.json());
  },

  /**
   * A function for getting a general record.
   * @param {string} country 
   * @param {number} year
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async getGeneralRecord(country, year, content) {
    const apiResponse = await apiCall(
      `records/${country}/${year}/general`,
      "GET",
      null,
      content
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return GeneralRecord.fromJson(await apiResponse.json());
  },

  /**
   * A function for updating an existing general record.
   * @param {string} country 
   * @param {number} year 
   * @param {number} GDP 
   * @param {number} population 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async putGeneralRecord(
    /** @type {string} */ country,
    /** @type {number} */ year,
    /** @type {number} */ gdp,
    /** @type {number} */ population,
    /** @type {string} */ content
  ) {
    const data = {};
    if (country !== undefined) data.country = country;
    if (year !== undefined) data.year = year;
    if (gdp !== undefined) data.gdp = gdp;
    if (population !== undefined) data.population = population;

    const apiResponse = await apiCall(`records/${country}/${year}/general`, "PUT", data, content);
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return GeneralRecord.fromJson(await apiResponse.json());
  },

  /**
   * A function for deleting an existing general record.
   * @param {string} country 
   * @param {number} year 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async deleteGeneralRecord(country, year, content) {
    const apiResponse = await apiCall(
      `records/${country}/${year}/general`,
      "DELETE",
      null,
      content
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

      return; //GeneralRecord.fromJson(await apiResponse.json());
  },

  /**
   * A function for getting an emission record.
   * @param {string} country 
   * @param {number} year 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async getEmissionRecord(country, year, content) {
    const data = {};
    if (year !== undefined) {
      data.year = year;
    }

    const apiResponse = await apiCall(
      `records/${country}/emission`,
      "GET",
      data,
      content
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return (await apiResponse.json()).map(EmissionRecord.fromJson);
  },

  /**
   * A function for getting a temperature change record.
   * @param {string} continent 
   * @param {number} year 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async getTempChangeRecord(continent, year, content) {
    const data = {};
    if (year !== undefined) {
      data.year = year;
    }

    const apiResponse = await apiCall(
      `records/${continent}/temp-change`,
      "GET",
      data,
      content
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return (await apiResponse.json()).map(TempChangeRecord.fromJson);
  },

  /**
   * A function for getting a list of energy records.
   * @param {number} year 
   * @param {string} orderBy 
   * @param {number} batchSize 
   * @param {number} batchIndex 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async getEnergyRecord(
    /** @type {number} */ year,
    /** @type {string} */ orderBy = "DESC",
    /** @type {number} */ batchSize = 10,
    /** @type {number} */ batchIndex = 1,
    /** @type {string} */ content
  ) {
    const apiResponse = await apiCall(`records/${year}/energy`, "GET", {
      order_dir: orderBy,
      batch_size: batchSize,
      batch_index: batchIndex,
      },
        content
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return (await apiResponse.json()).map(EnergyRecord.fromJson);
  },

  /**
   * A function for retrieving a list of country records.
   * @param {number} ncountries 
   * @param {string} orderBy 
   * @param {string} order 
   * @param {string} periodType 
   * @param {number} periodValue 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async getCountryRecord(
    /** @type {number} */ ncountries,
    /** @type {string} */ orderBy = "share_of_temperature_change_from_ghg",
    /** @type {string} */ order = "DESC",
    /** @type {string} */ periodType = "specific-year",
    /** @type {number} */ periodValue,
    /** @type {string} */ content
  ) {
    const apiResponse = await apiCall(`records/countries`, "GET", {
      num_countries: ncountries,
      orderBy: orderBy,
      order_dir: order,
      period_type: periodType,
      period_value: periodValue,
      },
      content
      );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());
    return (await apiResponse.json()).map(CountryRecord.fromJson);
  },

  /**
   * A function for updating an emissions CSV dataset.
   * @param {string} url 
   * @param {string} content
   * @returns {Record<string, any>}
   */
  async putSpecialRecord(
    /** @type {string} */ url,
    /** @type {string} */ content
  ) {
    const data = {};
    if (url !== undefined) data.emissions_csv_url = url;

    const apiResponse = await apiCall(`records`, "PUT", {
      emissions_csv_url: url,
      }, content);
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return SpecialRecord.fromJson(await apiResponse.json());
  },
};

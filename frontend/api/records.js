import apiCall from "./call.js";
import GeneralRecord from "../models/general.js";
import EmissionRecord from "../models/emission.js";
import EnergyRecord from "../models/energy.js";
import TempChangeRecord from "../models/temp-change.js";
import CountryRecord from "../models/country.js";

export default {
  async postGeneralRecord(
    /** @type {string} */ country,
    /** @type {number} */ year,
    /** @type {number} */ GDP,
    /** @type {number} */ population
  ) {
    const data = {};
    if (country !== undefined) data.country = country;
    if (year !== undefined) data.year = year;
    if (GDP !== undefined) data.GDP = GDP;
    if (population !== undefined) data.population = population;

    const apiResponse = await apiCall(`records/general`, "POST", data);
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return GeneralRecord.fromJson(await apiResponse.json());
  },

  async getGeneralRecord(country, year) {
    const apiResponse = await apiCall(
      `records/${country}/${year}/general`,
      "GET"
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return GeneralRecord.fromJson(await apiResponse.json());
  },

  async putGeneralRecord(
    /** @type {string} */ country,
    /** @type {number} */ year,
    /** @type {number} */ GDP,
    /** @type {number} */ population
  ) {
    const data = {};
    if (country !== undefined) data.country = country;
    if (year !== undefined) data.year = year;
    if (GDP !== undefined) data.GDP = GDP;
    if (population !== undefined) data.population = population;

    const apiResponse = await apiCall(`records/${country}/${year}/general`, "PUT", data);
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return GeneralRecord.fromJson(await apiResponse.json());
  },
  async deleteGeneralRecord(country, year) {
    const apiResponse = await apiCall(
      `records/${country}/${year}/general`,
      "DELETE"
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return GeneralRecord.fromJson(await apiResponse.json());
  },
  async getEmissionRecord(country, year) {
    const data = {};
    if (year !== undefined) {
      data.year = year;
    }

    const apiResponse = await apiCall(
      `records/${country}/emission`,
      "GET",
      data
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return EmissionRecord.fromJson(await apiResponse.json());
  },
  async getTempChangeRecord(continent, year) {
    const data = {};
    if (year !== undefined) {
      data.year = year;
    }

    const apiResponse = await apiCall(
      `records/${continent}/temp-change`,
      "GET",
      data
    );
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return TempChangeRecord.fromJson(await apiResponse.json());
  },

  async getEnergyRecord(
    /** @type {number} */ year,
    /** @type {number} */ orderBy = "descending",
    /** @type {number} */ batchSize = 10,
    /** @type {number} */ batchIndex = 1
  ) {
    const apiResponse = await apiCall(`records/${year}/energy`, "GET", {
      orderBy: orderBy,
      batchSize: batchSize,
      batchIndex: batchIndex,
    });
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return EnergyRecord.fromJson(await apiResponse.json());
  },
  async getCountryRecord(
    /** @type {number} */ ncountries,
    /** @type {string} */ orderBy = "share_of_temperature_change_from_ghg",
    /** @type {string} */ order = "descending",
    /** @type {string} */ periodType = "specific-year",
    /** @type {number} */ periodValue
  ) {
    const apiResponse = await apiCall(`records/countries`, "GET", {
      ncountries: ncountries,
      orderBy: orderBy,
      order: order,
      periodType: periodType,
      periodValue: periodValue,
    });
    if (!apiResponse.ok) throw new Error(await apiResponse.text());

    return CountryRecord.fromJson(await apiResponse.json());
  },
};

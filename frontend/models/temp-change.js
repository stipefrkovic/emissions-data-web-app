export default class TempChange{
    /** @type {string} */
    continent;
    /** @type {number} */
    year;
    /** @type {number} */
    shareOfTempChangeFromGhg;
    /** @type {number} */
    tempChangeFromCO2;
    /** @type {number} */
    tempChangeFromN2O;
    /** @type {number} */
    tempChangeFromGHG;
    /** @type {number} */
    tempChangeFromCH4;

    /**
     * Convert from JSON to TempChange instance
     * @param {Record<string, any>} json JSON returned by API
     * @returns {TempChange}
     */
    static fromJson(json){
        let tempChange = new TempChange();

        tempChange.year = json.year;
        tempChange.shareOfTempChangeFromGhg = json.share_of_temperature_change_from_ghg;
        tempChange.tempChangeFromCO2 = json.temperature_change_from_co2;
        tempChange.tempChangeFromN2O = json.temperature_change_from_n2o;
        tempChange.tempChangeFromGHG = json.temperature_change_from_ghg;
        tempChange.tempChangeFromCH4 = json.temperature_change_from_ch4;

        return tempChange;
    }
}
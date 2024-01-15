/**
 * A class repsonsible for temperature change record attributes.
 */
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

        tempChange.continent = json.continent;
        tempChange.year = json.year;
        tempChange.shareOfTempChangeFromGhg = json.shareOfTempChangeFromGhg;
        tempChange.tempChangeFromCO2 = json.tempChangeFromCO2;
        tempChange.tempChangeFromN2O = json.tempChangeFromN2O;
        tempChange.tempChangeFromGHG = json.tempChangeFromGHG;
        tempChange.tempChangeFromCH4 = json.tempChangeFromCH4;

        return tempChange;
    }
}
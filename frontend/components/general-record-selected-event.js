/**
 * A custom class to select a general record.
 */
export default class GeneralSelectedEvent extends Event {
    /** @type {string} */
    countryId;

    /** @type {string} */
    countryYear;
  
    /**
     * @param {string} countryId
     */
    constructor(countryId, countryYear) {
      super("general-record-selected");
  
      this.countryId = countryId;
      this.countryYear = countryYear;
    }
  }
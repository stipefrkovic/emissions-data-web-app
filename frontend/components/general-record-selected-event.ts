/**
 * A custom class to select a general record.
 */
export default class GeneralSelectedEvent extends Event {
    /** @type {string} */
    countryId;
  
    /**
     * @param {string} songId
     */
    constructor(countryId) {
      super("general-record-selected");
  
      this.countryId = countryId;
    }
  }
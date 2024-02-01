/**
 * This is a custom Event to represent a general record being selected,
 * carrying a countryId field with it to represent which general record is
 * being selected. This is used in the GeneralFinder element, to
 * inform the rest of the application that the user selected a general record.
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
      // We call the parent constructor with a string representing
      // the name of this event. This is what we listen to.
      super("general-record-selected");
  
      this.countryId = countryId;
      this.countryYear = countryYear;
    }
  }
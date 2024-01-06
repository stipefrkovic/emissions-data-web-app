export default class Country {

    /** @type {string} */
    name;

    /** @type {number} */
    share_of_temperature_change_from_ghg;

    static fromJson(json){
        let country = new Country();
        
        country.name = json.name;
        country.share_of_temperature_change_from_ghg = json.share_of_temperature_change_from_ghg;

        return country;
    }
}
export default class TempChange{
    /** @type {number} */
    share_of_temperature_change_from;

    /** @type {number} */
    temperature_change_from_;

    static fromJson(json){
        let tempChange = new TempChange();

        tempChange.share_of_temperature_change_from = json.share_of_temperature_change_from;
        tempChange.temperature_change_from_ = json.temperature_change_from_;

        return tempChange;
    }
}
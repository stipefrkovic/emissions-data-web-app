export default class Country {
    name!: string;
    shareOfTempChangeFromGhg?: number;

    static fromJson(json: Record<string, any>){
        let country = new Country();

        country.name = json.name;
        country.shareOfTempChangeFromGhg = json.shareOfTempChangeFromGhg;

        return country;
    }
}
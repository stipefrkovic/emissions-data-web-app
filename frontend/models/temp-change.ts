export default class TempChange{
    continent!: string;
    year!: number;
    shareOfTempChangeFromGhg!: number;
    tempChangeFromCO2!: number;
    tempChangeFromN2O!: number;
    tempChangeFromGHG!: number;
    tempChangeFromCH4!: number;

    static fromJson(json: Record<string, any>){
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
import { TempChange as DbTempChange } from "models/tempChange";

export class TempChange {
    shareOfTempChangeFromGhg: number;
    tempChangeFrom: number;

    public static fromDatabase(tempChange : DbTempChange) : TempChange {
        return {
            shareOfTempChangeFromGhg: tempChange.shareOfTempChangeFromGhg,
            tempChangeFrom: tempChange.tempChangeFrom
        };
    }
}
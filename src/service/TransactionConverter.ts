import {NewTransaction} from "ynab";
import {MBankDesktopConverter} from "./converters/mBankDesktopConverter.ts";
import {MBankMobileConverter} from "./converters/mBankMobileConverter.ts";

export interface Converter {
    id: string;
    name: string;
    convert: (input: File, accountId: string) => Promise<Array<NewTransaction>>;
}

export const transactionConverters: Record<string, Converter> = {
    mbankPlDesktopCSV: {
        id: 'mbankPlDesktopCSV',
        name: 'mBank PL desktop csv converter',
        convert: MBankDesktopConverter
    },
    mbankPlMobileCSV: {
        id: 'mbankPlMobileCSV',
        name: 'mBank PL mobile csv converter',
        convert: MBankMobileConverter
    }
};

import {NewTransaction} from "ynab";
import {mBankConverter} from "./converters/mBankConverter.ts";

export interface Converter {
    id: string;
    name: string;
    convert: (input: File, accountId: string) => Promise<Array<NewTransaction>>;
}

export const transactionConverters: Record<string, Converter> = {
    mbankPlCSV: {
        id: 'mbankPlCSV',
        name: 'mBank PL csv converter',
        convert: mBankConverter
    },
};

import * as ynab from 'ynab';
import {YNABConfig} from "../entity/YNABConfig.ts";
import {NewTransaction} from "ynab";

export const getBudgets = async (config: YNABConfig) => {
    const ynabAPI = new ynab.API(config.apiKey);
    const response = await ynabAPI.budgets.getBudgets();
    return response.data.budgets
}

export const getAccounts = async (config: YNABConfig) => {
    const ynabAPI = new ynab.API(config.apiKey);
    const response = await ynabAPI.accounts.getAccounts(config.budgetId);
    return response.data.accounts;
}

export const saveTransactions = async (config: YNABConfig, transactions: Array<NewTransaction>) => {
    const ynabAPI = new ynab.API(config.apiKey);
    const response = await ynabAPI.transactions.createTransactions(config.budgetId, {transactions});
    return response.data.transaction_ids;
}
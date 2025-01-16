import React, {createContext, useContext, useEffect, useState} from 'react';
import {YNABConfig} from "../entity/YNABConfig.ts";
import {Account, BudgetSummary, NewTransaction} from "ynab";
import {getBudgets} from "../api/YNABApiService.ts";
import {Converter, transactionConverters} from "../service/TransactionConverter.ts";
import Cookies from 'js-cookie';

interface StepperContextType {
    isMobile: boolean;
    expectedPassword: string;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    config: YNABConfig;
    setConfig: React.Dispatch<React.SetStateAction<YNABConfig>>;
    budgets: Array<BudgetSummary>;
    setBudgets: React.Dispatch<React.SetStateAction<Array<BudgetSummary>>>;
    accounts: Array<Account>;
    setAccounts: React.Dispatch<React.SetStateAction<Array<Account>>>;
    file: File | null,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    converters: Record<string, Converter>;
    converter: Converter;
    setConverter: React.Dispatch<React.SetStateAction<Converter>>;
    transactions: Array<NewTransaction>;
    setTransactions: React.Dispatch<React.SetStateAction<Array<NewTransaction>>>;
    transactionsToImport: Array<NewTransaction>;
    setTransactionsToImport: React.Dispatch<React.SetStateAction<Array<NewTransaction>>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeStep, setActiveStep] = useState(0);
    const [config, setConfig] = useState<YNABConfig>({
        apiKey: import.meta.env.VITE_YNAB_API_KEY || '',
        budgetId: Cookies.get('ynab_importer_budgetId') || '',
        accountId: Cookies.get('ynab_importer_accountId') || '',
    });
    const expectedPassword = import.meta.env.VITE_PASSWORD;
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [budgets, setBudgets] = useState<Array<BudgetSummary>>([]);
    const [accounts, setAccounts] = useState<Array<Account>>([]);
    const [file, setFile] = useState<File | null>(null);
    const converters = transactionConverters;
    const [converter, setConverter] = useState<Converter>(transactionConverters[Object.keys(transactionConverters)[0]]);
    const [transactions, setTransactions] = useState<Array<NewTransaction>>([]);
    const [transactionsToImport, setTransactionsToImport] = useState<Array<NewTransaction>>([]);

    useEffect(() => {
        getBudgets(config)
            .then((response) => {
                setBudgets(response);
            })
            .catch(() => {
                setError("API key is invalid, please fix it in the configuration");
            });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        Cookies.set('ynab_importer_budgetId', config.budgetId, { expires: 7 });
        Cookies.set('ynab_importer_accountId', config.accountId, { expires: 7 });
    }, [config]);

    return (
        <StepperContext.Provider
            value={{
                isMobile,
                expectedPassword,
                password,
                setPassword,
                activeStep,
                setActiveStep,
                config,
                setConfig,
                budgets,
                setBudgets,
                accounts,
                setAccounts,
                file,
                setFile,
                converters,
                converter,
                setConverter,
                transactions,
                setTransactions,
                transactionsToImport,
                setTransactionsToImport,
                error,
                setError,
            }}
        >
            {children}
        </StepperContext.Provider>
    );
};

export const useStepperContext = () => {
    const context = useContext(StepperContext);
    if (!context) {
        throw new Error('useStepperContext must be used within a StepperProvider');
    }
    return context;
};

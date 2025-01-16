export interface YNABConfig {
    apiKey: string;
    budgetId: string;
    accountId: string;
}

export interface ComponentConfigProps {
    config: YNABConfig;
    setConfig: (config: YNABConfig) => void;
}
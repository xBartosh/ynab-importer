import { FC, useEffect, useState } from "react";
import { Box, MenuItem, Select } from "@mui/material";
import { useStepperContext } from "../context/YNABStepperContext.tsx";
import { getAccounts } from "../api/YNABApiService.ts";

export const AccountChoice: FC = () => {
    const { config, setConfig, accounts, setAccounts } = useStepperContext();
    const [account, setAccount] = useState<string>('');

    useEffect(() => {
        getAccounts(config)
            .then((response) => {
                setAccounts(response);
            });

        if (config.accountId) {
            setAccount(config.accountId);
        }
    }, [config.accountId]);

    const handleAccountChange = (accountId: string) => {
        setConfig({
            ...config,
            accountId: accountId,
        });
        setAccount(accountId);
    };

    return (
        <Box>
            <Select
                label="Account ID"
                variant="standard"
                fullWidth
                required
                autoFocus
                value={account}
                onChange={(e) => handleAccountChange(e.target.value as string)}
            >
                {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>{`${account.name} (${account.id})`}</MenuItem>
                ))}
            </Select>
        </Box>
    );
};

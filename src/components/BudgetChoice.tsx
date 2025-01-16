import { FC, useEffect, useState } from "react";
import { Box, MenuItem, Select } from "@mui/material";
import { useStepperContext } from "../context/YNABStepperContext.tsx";

export const BudgetChoice: FC = () => {
    const [budget, setBudget] = useState<string>('');
    const { config, setConfig, budgets } = useStepperContext();

    useEffect(() => {
        if (config.budgetId) {
            setBudget(config.budgetId);
        }
    }, [config.budgetId]);

    const updateConfig = (budgetId: string) => {
        setConfig({
            ...config,
            budgetId: budgetId,
        });
        setBudget(budgetId);
    };

    return (
        <Box>
            <Select
                label="Budget ID"
                variant="standard"
                fullWidth
                required
                autoFocus
                value={budget}
                onChange={(e) => updateConfig(e.target.value as string)}
            >
                {budgets.map((budget) => (
                    <MenuItem key={budget.id} value={budget.id}>{`${budget.name} (${budget.id})`}</MenuItem>
                ))}
            </Select>
        </Box>
    );
};

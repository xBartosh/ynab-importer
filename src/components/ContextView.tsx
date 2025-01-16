import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {useStepperContext} from "../context/YNABStepperContext.tsx";

const ContextView = () => {
    const {config, budgets, accounts, file, converter} = useStepperContext();

    return (
        <Box width="100%">
            <Typography variant="h6" gutterBottom>
                Current Selections Overview
            </Typography>
            <TableContainer sx={{ width: '100%' }}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Budget</TableCell>
                            <TableCell>Account</TableCell>
                            <TableCell>File</TableCell>
                            <TableCell>Converter</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{budgets.find(budget => budget.id === config.budgetId)?.name || '-'}</TableCell>
                            <TableCell>{accounts.find(account => account.id === config.accountId)?.name || '-'}</TableCell>
                            <TableCell>{file?.name || '-'}</TableCell>
                            <TableCell>{converter.name || '-'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ContextView;

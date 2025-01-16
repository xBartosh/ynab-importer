import {useStepperContext} from "../context/YNABStepperContext.tsx";
import {useEffect} from "react";
import {Paper} from "@mui/material";
import {DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";

const TransactionChoice = () => {
    const {config, converter, file, transactions, setTransactions, setTransactionsToImport} = useStepperContext();

    useEffect(() => {
        const getTransactions = async () => {
            const transactions = await converter.convert(file!, config.accountId);
            setTransactions(transactions);
        }

        getTransactions();
    }, []);

    const columns = [
        {field: 'id', headerName: 'ID', width: 40, onpagehide: true},
        {field: 'payee_name', headerName: 'Payee', width: 350},
        {field: 'date', headerName: 'Date', width: 150},
        {field: 'amount', headerName: 'Amount', width: 150},
    ]

    const rows = transactions.map((transaction, index) => {
        return {
            id: index,
            date: transaction.date,
            payee_name: transaction.payee_name,
            amount: (transaction.amount! / 1000).toFixed(2),
        }
    });

    const handleSelection = (selection: GridRowSelectionModel) => {
        setTransactionsToImport(
            selection.map(selectedId =>
                transactions.find((_, index) => index === selectedId)!)
        );
    }

    return (
        <Paper sx={{height: 300, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableColumnResize
                onRowSelectionModelChange={(newSelection) => handleSelection(newSelection)}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false
                        },
                    }
                }}
            />
        </Paper>
    );
}

export default TransactionChoice;
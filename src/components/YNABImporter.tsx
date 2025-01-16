import {useStepperContext} from "../context/YNABStepperContext.tsx";
import {useEffect, useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {saveTransactions} from "../api/YNABApiService.ts";

const YNABImporter = () => {
    const {config, transactionsToImport} = useStepperContext();
    const [numImported, setNumImported] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const save = async () => {
            try {
                const response = await saveTransactions(config, transactionsToImport);
                setNumImported(response.length)
            } catch {
                console.error('Error saving transactions');
            } finally {
                setLoading(false);
            }
        }

        save()
    }, []);

    return (
        <Box>
            {loading ? (
                <CircularProgress/>
            ) : (
                <Box>
                    <Typography>Successfully imported {numImported} transactions</Typography>
                </Box>
            )
            }
        </Box>
    );
}

export default YNABImporter;
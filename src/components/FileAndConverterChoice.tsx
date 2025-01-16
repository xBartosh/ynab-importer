import {MuiFileInput} from "mui-file-input";
import {useState} from "react";
import {UploadFileOutlined} from "@mui/icons-material";
import {useStepperContext} from "../context/YNABStepperContext.tsx";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const FileAndConverterChoice = () => {
    const {file, setFile, converter, setConverter, converters} = useStepperContext();
    const [transactionConverter, setTransactionConverter] = useState(converter);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <MuiFileInput
                placeholder="Upload a file"
                value={file}
                onChange={(e) => setFile(e)}
                InputProps={{
                    startAdornment: <UploadFileOutlined />,
                }}
            />

            <FormControl
                variant="outlined"
            >
                <InputLabel id="converter-label">Converter</InputLabel>
                <Select
                    labelId="converter-label"
                    value={transactionConverter?.id || ''}
                    label="Converter"
                    onChange={(e) => {
                        const selectedConverter = converters[e.target.value as string];
                        setTransactionConverter(selectedConverter);
                        setConverter(selectedConverter);
                    }}
                >
                    {Object.values(converters).map((converter) => (
                        <MenuItem key={converter.id} value={converter.id}>{converter.name}</MenuItem>
                    ))}
                </Select>

            </FormControl>
        </Box>
    )
}

export default FileAndConverterChoice;

import YNABStepper from "./components/YNABStepper.tsx";
import {Box, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import img from "../public/YNAB-Logo-Dark.png"

function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Box
            px={3}
            my={2}
            display="flex"
            flexDirection="column"
            gap={4}
            justifyContent="center"
            maxWidth={"1200px"}
            margin="0 auto"
        >
            <Box display="flex" flexDirection={isMobile ? "column" : "row"} alignItems="center" gap={1}>
                <Box
                    component="img"
                    src={img}
                    alt="YNAB"
                    sx={{
                        height: '3rem',
                        borderRadius: '12px',
                    }}
                />
                <Typography variant="h4" textAlign="left">Transaction importer</Typography>
            </Box>
            <YNABStepper/>
        </Box>
    )
}

export default App

import {BudgetChoice} from './BudgetChoice.tsx';
import {AccountChoice} from './AccountChoice.tsx';
import {Alert, Box, Button, Step, StepLabel, Stepper, Typography} from '@mui/material';
import {StepperProvider, useStepperContext} from "../context/YNABStepperContext.tsx";
import FileAndConverterChoice from "./FileAndConverterChoice.tsx";
import TransactionChoice from "./TransactionChoice.tsx";
import {YNABStep} from "../entity/YNABStep.ts";
import YNABImporter from "./YNABImporter.tsx";
import ContextView from "./ContextView.tsx";

const YNABStepperContent = () => {
    const {isMobile, activeStep, setActiveStep, config, setConfig, file, error, transactionsToImport, setError} = useStepperContext();

    const steps: YNABStep[] = [
        {
            label: 'Choose your budget',
            description: 'Select your budget.',
            Component: BudgetChoice,
            onNext: () => {
                if (!config.budgetId) {
                    setError('Please select a budget');
                    return false;
                }
                setError(null);
                return true;
            },
        },
        {
            label: 'Choose your account',
            description: 'Select your account.',
            Component: AccountChoice,
            onNext: () => {
                if (!config.accountId) {
                    setError('Please select an account');
                    return false;
                }
                setError(null);
                return true;
            },
        },
        {
            label: 'Choose your file and coverter',
            description: 'Select your file and converter',
            Component: FileAndConverterChoice,
            onNext: () => {
                if (!file) {
                    setError('Please select a file');
                    return false;
                }

                setError(null);
                return true;
            },
            nextButtonLabel: 'Convert'
        },
        {
            label: 'Choose your transactions',
            description: 'Select your transactions',
            Component: TransactionChoice,
            onNext: () => {
                if (!transactionsToImport || transactionsToImport.length <= 0) {
                    setError('Please select transactions');
                    return false;
                }

                setError(null);
                return true;
            },
            nextButtonLabel: 'Import to YNAB'
        },
        {
            label: 'Finish',
            description: 'All steps completed!',
            Component: YNABImporter,
            onNext: () => {
                return true;
            }
        }
    ];

    const handleNext = async () => {
        const canProceed = steps[activeStep].onNext();
        if (canProceed) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const CurrentComponent = steps[activeStep]?.Component;

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            {error && (
                <Alert sx={{mt: 2}} severity="error">
                    {error}
                </Alert>
            )}
            <Box sx={{display: 'flex', width: '100%', flexDirection: isMobile ? "column" : "row", gap: 3}}>
                <Box sx={{flexBasis: '25%', borderRight: isMobile ? '' : '1px solid #ddd', paddingRight: isMobile ? 0 : 2}}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel>{step.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box sx={{flexGrow: 1, paddingLeft: isMobile ? 0 : 2}}>
                    {activeStep === steps.length ? (
                        <Box>
                            <Typography variant="h6">All steps completed!</Typography>
                            <Button onClick={handleReset} variant="contained" sx={{marginTop: '10px'}}>
                                Reset
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h6">{steps[activeStep].description}</Typography>
                            <Box sx={{marginY: '20px'}}>
                                {CurrentComponent && <CurrentComponent config={config} setConfig={setConfig}/>}
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                                    Back
                                </Button>
                                <Button onClick={handleNext} variant="contained">
                                    {activeStep === steps.length - 1 ? 'Finish' : steps[activeStep].nextButtonLabel || 'Next'}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            <ContextView/>
        </Box>
    );
};

const YNABStepper = () => (
    <StepperProvider>
        <YNABStepperContent/>
    </StepperProvider>
);

export default YNABStepper;

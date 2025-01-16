import {Box} from "@mui/material";
import {useStepperContext} from "../context/YNABStepperContext.tsx";

const PasswordForm = () => {
    const {password, setPassword} = useStepperContext();

    return (
        <Box>
            <form>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ padding: "10px", fontSize: "16px", borderRadius: "5px" }}
                />
            </form>
        </Box>
    )
}

export default PasswordForm;
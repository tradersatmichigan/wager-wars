// PL Chart using MUI charts which you need to download to see. 
// Honestly looks pretty mid but I see potential

// import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Container } from '@mui/material';
import { containerStyle } from "../theme/theme";


const TeamStackVals = [10000, 12000, 5000, 3000, 20000]; // would need to be grabbed from DB. Team Stack values over time.

export default function PL_Chart() {
    return (


        <Box sx={containerStyle}>
            <Container maxWidth="md">
                <LineChart
                    xAxis={[
                        {
                            id: "P/L",
                            scaleType: "band",
                            data: ["Rd 1", "Rd 2", "Rd 3", "Rd 4", "Rd 5"], // Also needs to be set up dynamically depending on round we are on.
                            tickMinStep: 1
                        },
                    ]}
                    series={[
                        {
                            data: TeamStackVals,
                            label: "Team Stack",
                            curve: "linear",
                            color: "black"
                        },
                    ]}
                    width={100 * TeamStackVals.length}
                    height={300}

                />
            </Container>
        </Box>





    );
}

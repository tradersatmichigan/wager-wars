// Page for between rounds w/ team info, teammate info, and p/l graph
import Leaderboard from "./leaderboard"
import PL_Chart from "./PL_chart"
import TeamInfo from "./team_info"

import { Box, Container } from '@mui/material';

import { containerStyle } from "../theme/theme";

// Page just combines the three things we want on the opage into one object to be rendered by root.
// It looks absolutely disgusting but I couldn't get all the components to show up without doing this
// It's also unclear whether this is what causes it to look like shit or not. Someone who knows MUI
// should try to make it look better. 
export default function Betting1() {
    return (

        <Container
            maxWidth={false}
            disableGutters sx={{
                ...containerStyle,
                flexDirection: "row",
            }}>
            <Box sx={{
                width: "20%",
                flexDirection: "column",
                gap: "1rem",
                display: "flex",
               
            }}>
                <Leaderboard />
                <TeamInfo />
            </Box>
            <Box sx={{
                flex: "1",
                width: "80%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                
            }}>
                <PL_Chart />
            </Box>
        </Container>


    )
}





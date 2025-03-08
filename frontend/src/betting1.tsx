// Page for between rounds w/ team info, teammate info, and p/l graph
import Leaderboard from "./leaderboard"
import PL_Chart from "./PL_chart"
import TeamInfo from "./team_info"

import {Box} from '@mui/material';

// Page just combines the three things we want on the opage into one object to be rendered by root.
// It looks absolutely disgusting but I couldn't get all the components to show up without doing this
// It's also unclear whether this is what causes it to look like shit or not. Someone who knows MUI
// should try to make it look better. 
export default function Betting1() {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "right", 
                background: 'transparent',
      
                width: "fit-content",
                minHeight: "100vh",
                gap: "20px", 
            }}
        >
            <Leaderboard /> 
            <PL_Chart/>
            <TeamInfo/>
        </Box>
    )
}





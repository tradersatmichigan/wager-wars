// Grabs team info for betting1 (between rounds page)
// Just displays your teammates' stacks


/*
TODO: Change hardcoded data to dynamic:

variables:

teammates
logname (name of the current user). NOT needed for functionality, just style.
teamname (name of user's team). NOT needed for functionality, just style.

*/
import {
    Box,
    Typography,
    Paper,
} from '@mui/material';

import { containerStyle, paperStyle, listStyle, headerStyle, textStyle } from "../theme/theme";




// Hardcoded needs a useEffect
const teammates = [
    { name: "Teammate1", id: 1, stack: 5000 },
    { name: "Teammate2", id: 2, stack: 4000 },
    { name: "Teammate3", id: 3, stack: 3000 },
    { name: "Teammate4", id: 4, stack: 2000 },
    { name: "Teammate5", id: 5, stack: 0 },
    { name: "Esben", id: 6, stack: 2345 },
    { name: "Esben2", id: 7, stack: 234 },
    { name: "Esben3", id: 8, stack: 23 },
];

const logname = "Esben" // hardcoded


const teamName = "Team Name"; //hardcoded





export default function TeamInfo() {
    return (

        <Paper elevation={3} sx={{ ...paperStyle, padding: "0" }}>
            <Typography sx={{ ...headerStyle, padding: "10px 0px 10px 0px" }}>
                Team Info
            </Typography>

            <Paper elevation={3} sx={{
                ...paperStyle, maxHeight: "28vh",
                overflowY: "auto",
            }}>
                {teammates.map((teammate, index) => (
                    <Box
                        key={teammate.id}
                        sx={{
                            ...listStyle,
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: teammate.name === logname ? "bold" : "normal",
                                color: teammate.stack > 0 ? "black" : "gray",
                                ...textStyle,
                            }}
                        >
                            {index + 1}. {teammate.name}
                        </Typography>


                        <Typography
                            sx={{
                                fontWeight: teammate.name === logname ? "bold" : "normal",
                                color: teammate.stack > 0 ? "black" : "gray",
                                textAlign: "right",
                                padding: "0px 0px 0px 10px",
                                ...textStyle,
                            }}
                        >
                            ${teammate.stack.toLocaleString()}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        </Paper>
    );
};


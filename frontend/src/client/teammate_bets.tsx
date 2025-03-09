//For betting2 (bet page), displays list of your teammates' current bets for the round

// CURRENTLY NOT BEING USED, just didn't delete in case.

import {
    Box,
    Typography,
    Paper,
} from '@mui/material';

import { paperStyle, listStyle, headerStyle, textStyle } from "../theme/theme";

//Hardcoded needs to be grabbed
const teammates = [
    { name: "Teammate1 With long name", id: 1, bet: 500000000 },
    { name: "Teammate2", id: 2, bet: 400 },
    { name: "Teammate3", id: 3, bet: 300 },
    { name: "Teammate4", id: 4, bet: 200 },
    { name: "Teammate5", id: 5, bet: 0 },
    { name: "Esben", id: 6, bet: 234 },
    { name: "Esben2", id: 7, bet: 23 },
    { name: "Esben3", id: 8, bet: 2 },
];


// Hardcoded needs to be grabbed
const logname = "Esben"




export default function TeammateBets() {

    return (

        <Paper elevation={3} sx={{...paperStyle, padding: "0"}}>
            <Typography sx={{ ...headerStyle, padding: "10px 0px 10px 0px" }}>
                Teammate Bets
            </Typography>

            <Paper elevation={3} sx={{
                ...paperStyle, maxHeight: "40vh",
                overflowY: "auto",
            }}>


                {teammates.map((teammate, index) => (
                    <Box
                        key={index}
                        sx={{
                            ...listStyle,
                            justifyContent: "space-between",
                           
                        }}
                    >
                    {/* 2 separate components for each to make sure scales w/ long team names and/or long stacks */}
                        <Typography
                            sx={{
                                color: teammate.bet > 0 ? "black" : "gray",
                                fontWeight: teammate.name === logname ? "bold" : "", 
                                ...textStyle,
                            }}
                        >
                            {index + 1}. {teammate.name}
                        </Typography>


                        <Typography
                            sx={{
                               
                                color: teammate.bet > 0 ? "black" : "gray",
                                fontWeight: teammate.name === logname ? "bold" : "", 
                                textAlign: "right",
                                padding: "0px 0px 0px 10px",
                                ...textStyle,
                            }}
                        >
                            ${teammate.bet.toLocaleString()}
                        </Typography>
                    </Box>
                ))}
            </Paper>
       </Paper>

    );
};


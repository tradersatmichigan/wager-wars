// P/L graph

/*
TODO: Change hardcoded data to dynamic:

variables:

data (contains rounds and stack for that round)

*/


import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { headerStyle } from "../theme/theme";

const data = [
    { round: "Round 1", value: 10000 },
    { round: "Round 2", value: 12000 },
    { round: "Round 3", value: 5000 },
    { round: "Round 4", value: 3000 },
    { round: "Round 5", value: 20000 },
    { round: "Round 6", value: 23452 },
    { round: "Round 7", value: 6224 },
    { round: "Round 8", value: 45234 },
    { round: "Round 9", value: 23452 },
    { round: "Round 10", value: 9876 },
    { round: "Round 11", value: 7435 },
    { round: "Round 12", value: 89764 },
    { round: "Round 13", value: 86466 },
    { round: "Round 14", value: 36444 },
    { round: "Round 15", value: 89765 },
];

export default function PL_Chart() {
    const appleFont = "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

    return (
        <Box sx={{ width: "80vw", height: "80vh" }}>
            {/* Chart Title */}
            <Typography sx={{ ...headerStyle, padding: "10px 0px 10px 0px" }}>
                P/L Chart
            </Typography>
            {/* Responsive container fills the remaining viewport height */}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                    <Tooltip contentStyle={{ fontFamily: appleFont }} />
                    <XAxis tick={{ style: { fontFamily: appleFont } }}> </XAxis>
                    <YAxis tick={{ style: { fontFamily: appleFont } }}> </YAxis>
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#000" />

                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}

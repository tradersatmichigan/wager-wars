// Very basic component to be filled w/ question info from API.

/*
TODO: Change hardcoded data to dynamic:

variables:

Question (literally the text). Assume we hardcode somewhere on frontend and just use a round var to choose question or something.

*/


import {
    Typography
} from '@mui/material';

import {headerStyle} from "../theme/theme";


export default function QuestionInfo() {

    //hardcoded atm
    const question = "<EXAMPLE> Say we have a coin with 60% odds of heads and 40% odds of tails. The payout if the coin is heads is 2x."
    return (

        <Typography
            sx={{
                ...headerStyle,
                fontSize: "40px",
                width: "90%"
            }}
        >
           {question}
        </Typography>


    )
}
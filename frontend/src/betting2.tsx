// Page for mid-round betting. Needs a clock as well as question info implemented.
import TeamBets from "./all_team_bets"
import TeammateBets from "./teammate_bets"
import BetForm from "./bet_form"


import { Box } from '@mui/material';


// See comment in betting1 if confused about this function.
// TL:DR: couldnt get every object to show up so put them into one object. Looks very bad
export default function Betting2() {

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "right",
        background: 'transparent',

        width: "fit-content",
        minHeight: "100vh",
        gap: "40px",
      }}
    >
      <TeammateBets />
      <TeamBets />
      <BetForm />
    </Box>
  )
}


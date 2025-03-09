import TeamBets from "./all_team_bets";
// import TeammateBets from "./teammate_bets";
import BetForm from "./bet_form";
import QuestionInfo from "./question_info"
import Timer from "./timer"
import { Box, Container, Typography } from "@mui/material";

import { containerStyle } from "../theme/theme";

export default function Betting2() {
  return (

    <Container
      maxWidth={false}
      disableGutters
      sx={{
        ...containerStyle,
        flexDirection: "row",
      }}>

      <Box sx={{
        width: "70%",
        flexDirection: "column",
        gap: "1rem",
        display: "flex",
        alignItems: "center",

      }}>
       <QuestionInfo />
        {/*<TeammateBets />*/}

        <Box sx={{padding: "20px"}}></Box> {/* Just for space between components */}

        <BetForm />
        <Timer />
      </Box>
      <Box sx={{
        flex: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      

      }}>
        <TeamBets />
      </Box>


    </Container>


  )
}

import { useState, useEffect } from 'react';
import Leaderboard from '../common/Leaderboard';
import LoadingSpinner from '../common/LoadingSpinner';
import type { LeaderboardResponse } from '../../types';
import {
  Box,
  Typography,
  Paper,
  styled
} from "@mui/material";
import { fetchData } from '@/utils/fetch-utils';

const BasePodiumBox = styled(Paper)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
  width: "150px",
  paddingBottom: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: theme.shadows[4],
  color: "#fff",
}));

// Podiums with standardized gradients
const FirstPlacePodium = styled(BasePodiumBox)(() => ({
  height: "217px",
  background:
    "linear-gradient(to right, #D4A52F 0%, #FFCE44 20%, #FFCE44 80%, #D4A52F 100%)",
  color: "#000", // Better contrast
}));

const SecondPlacePodium = styled(BasePodiumBox)(() => ({
  height: "155px",
  background:
    "linear-gradient(to right, #03264E 0%, #064389 20%, #064389 80%, #03264E 100%)",
}));

const ThirdPlacePodium = styled(BasePodiumBox)(() => ({
  height: "112px",
  background:
    "linear-gradient(to right, #03264E 0%, #064389 20%, #064389 80%, #03264E 100%)",
}));

const MedalEmoji = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translate(-50%, -14%)",
  fontSize: "4.4rem",
}));

function AdminGameOverScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchLeaderboard = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await fetchData<LeaderboardResponse>('/api/teams/leaderboard/');
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  if (loading && !leaderboard) return <LoadingSpinner />;
  if (!leaderboard) return null;

  return (
    <div className="admin-projection-panel">
      
      {/* HEADER */}
      <Box textAlign="center" mb={2} mt={3}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            fontFamily: '"Helvetica Neue", sans-serif',
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
          }}
          gutterBottom
        >
          Game Over!
        </Typography>
      </Box>

      {/* PODIUM SECTION */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        mb={3}
        sx={{ gap: 1, backgroundColor: "#2d4a7c", borderRadius: "2rem" }}
        padding={"3rem"}
      >
        {/* SECOND PLACE */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: '"Helvetica Neue", sans-serif',
              textShadow: "0.7px 0.3px 1.5px rgba(0, 0, 0, 0.5)",
            }}
          >
            {leaderboard.teams[1].team_name}
          </Typography>
          <SecondPlacePodium>
            <MedalEmoji>{"🥈"}</MedalEmoji>
            <Typography variant="h5" fontWeight="bold" mt={6}>
              ${leaderboard.teams[1].avg_stack.toLocaleString()}
            </Typography>
          </SecondPlacePodium>
        </Box>

        {/* FIRST PLACE */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: '"Helvetica Neue", sans-serif',
              textShadow: "0.7px 0.3px 1.5px rgba(0, 0, 0, 0.5)",
            }}
          >
            {leaderboard.teams[0].team_name}
          </Typography>
          <FirstPlacePodium>
            <MedalEmoji>{"🥇"}</MedalEmoji>
            <Typography variant="h5" fontWeight="bold" mt={6}>
              ${leaderboard.teams[0].avg_stack.toLocaleString()}
            </Typography>
          </FirstPlacePodium>
        </Box>

        {/* THIRD PLACE */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontFamily: '"Helvetica Neue", sans-serif',
              textShadow: "0.7px 0.3px 1.5px rgba(0, 0, 0, 0.5)",
            }}
          >
          {leaderboard.teams[2].team_name}
          </Typography>
          <ThirdPlacePodium>
            <MedalEmoji>{"🥉"}</MedalEmoji>
            <Typography variant="h5" fontWeight="bold" mt={6}>
              ${leaderboard.teams[2].avg_stack.toLocaleString()}
            </Typography>
          </ThirdPlacePodium>
        </Box>
      </Box>

      <Leaderboard />
      <Box mb={6}></Box>
    </div>
  );
}

export default AdminGameOverScreen;

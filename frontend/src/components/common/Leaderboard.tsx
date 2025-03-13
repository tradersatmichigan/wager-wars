import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { LeaderboardResponse, GameState } from '../../types';
import { fetchData } from '../../utils/fetch-utils';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function Leaderboard() {
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
    <Box sx={{ width: "30%", mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        textAlign="center"
        sx={{ textShadow: "0.5px 0.3px 1.1px rgba(0, 0, 0, 0.5)" }}
      >
        Team Leaderboard
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
                Rank
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
                Team
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.2em" }}>
                Average Stack
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.teams.map((team, index) => (
                <TableRow key={team.team_id}>
                  <TableCell align="left" sx={{ fontSize: "1.2em" }}>
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && (index + 1)}
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "1.2em" }}>{team.team_name}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.2em" }}>
                    ${team.avg_stack.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Leaderboard;

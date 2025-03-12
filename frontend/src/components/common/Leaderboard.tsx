import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { LeaderboardResponse, GameState } from '../../types';
import { fetchData } from '../../utils/fetch-utils';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [playerTeamId, setPlayerTeamId] = useState<number | null>(null);
  
  // Get player's team ID when component mounts
  useEffect(() => {
    const fetchPlayerInfo = async (): Promise<void> => {
      try {
        const data = await fetchData<GameState>('/api/game/state/');
        if (data.team_id) {
          setPlayerTeamId(data.team_id);
        }
      } catch (error) {
        console.error('Error fetching player info:', error);
      }
    };
    
    fetchPlayerInfo();
  }, []);
  
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
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading && !leaderboard) return <LoadingSpinner />;
  if (!leaderboard) return null;
  
  return (
    <div className="leaderboard">
      <h2>Team Leaderboard</h2>
      
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Total Stack</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.teams.map((team, index) => (
            <tr 
              key={team.team_id} 
              className={team.team_id === playerTeamId ? 'player-team' : ''}
            >
              <td>{index + 1}</td>
              <td>{team.team_name}</td>
              <td>${team.total_stack.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;

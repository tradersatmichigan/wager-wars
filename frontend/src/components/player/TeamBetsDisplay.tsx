import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import type { TeamBetsResponse, GameState } from '../../types';
import { fetchData } from '../../utils/fetch-utils';

function TeamBetsDisplay() {
  const [teamBets, setTeamBets] = useState<TeamBetsResponse | null>(null);
  const [playerTeamId, setPlayerTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch player's team ID
  useEffect(() => {
    const fetchPlayerInfo = async () => {
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

  // Fetch all team bets
  useEffect(() => {
    const fetchTeamBets = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchData<TeamBetsResponse>('/api/teams/bets/');
        setTeamBets(data);
      } catch (error: any) {
        console.error('Error fetching team bets:', error);
        setError('Failed to load team bets');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamBets();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-state">{error}</div>;
  if (!teamBets) return null;

  // Sort teams so player's team appears first in the grid
  const sortedTeams = [...teamBets.teams].sort((a, b) => (a.team_id === playerTeamId ? -1 : 1));

  return (
    <div className="team-bets">
      <h2>Team Bets</h2>
      <p>Discuss with your teammates before final betting!</p>

      {/* Grid layout for all teams including the player's team */}
      <div className="teams-grid">
        {sortedTeams.map(team => (
          <div 
            key={team.team_id} 
            className={`team-card ${team.team_id === playerTeamId ? "player-team" : ""}`}
          >
            <h3>{team.team_name}</h3>
            <div className="team-total-bar">
              Total: ${team.bets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString()}
            </div>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Bet</th>
                </tr>
              </thead>
              <tbody>
                {team.bets.map(bet => (
                  <tr key={bet.player_name}>
                    <td>{bet.player_name}</td>
                    <td>${bet.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamBetsDisplay;

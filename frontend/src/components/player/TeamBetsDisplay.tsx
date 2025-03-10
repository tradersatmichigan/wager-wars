import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import type { TeamBetsResponse, GameState } from '../../types';
import { fetchData } from '../../utils/fetch-utils';

function TeamBetsDisplay() {
  const [teamBets, setTeamBets] = useState<TeamBetsResponse | null>(null);
  const [playerTeamId, setPlayerTeamId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // First get the player's team ID
  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        const data = await fetchData<GameState>('/api/game/state/');
        if (data.team_id) {
          setPlayerTeamId(data.team_id);
          console.log("Player's team ID:", data.team_id);
        }
      } catch (error) {
        console.error('Error fetching player info:', error);
      }
    };
    
    fetchPlayerInfo();
  }, []);
  
  // Then fetch all team bets
  useEffect(() => {
    const fetchTeamBets = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching team bets...");
        const data = await fetchData<TeamBetsResponse>('/api/teams/bets/');
        console.log("Team bets data:", data);
        setTeamBets(data);
      } catch (error: any) {
        console.error('Error fetching team bets:', error);
        setError('Failed to load team bets');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamBets();
    
    // Refresh every 5 seconds during information phase
    //const interval = setInterval(fetchTeamBets, 5000);
    //return () => clearInterval(interval);
  }, []);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-state">{error}</div>;
  if (!teamBets) return null;
  
  // First display player's team
  const playerTeam = teamBets.teams.find(team => team.team_id === playerTeamId);
  
  // Then display other teams
  const otherTeams = teamBets.teams.filter(team => team.team_id !== playerTeamId);
  
  return (
    <div className="team-bets">
      <h2>Team Bets</h2>
      <p>Discuss with your teammates before final betting!</p>
      
      {/* Player's team highlighted first */}
      {playerTeam && (
        <div className="player-team-section" style={{ marginBottom: '20px' }}>
          <h3>Your Team</h3>
          <div className="team-card player-team" style={{ 
            backgroundColor: 'rgba(55, 114, 255, 0.1)',
            border: '1px solid #3772ff'
          }}>
            <h3>{playerTeam.team_name}</h3>
            <div className="team-total-bar">
              <span>Total: ${playerTeam.bets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString()}</span>
            </div>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Bet</th>
                </tr>
              </thead>
              <tbody>
                {playerTeam.bets.map(bet => (
                  <tr key={bet.player_name}>
                    <td>{bet.player_name}</td>
                    <td>${bet.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* All other teams */}
      <div className="other-teams-section">
        <h3>Other Teams</h3>
        <div className="teams-grid">
          {otherTeams.map(team => (
            <div key={team.team_id} className="team-card">
              <h3>{team.team_name}</h3>
              <div className="team-total-bar">
                <span>Total: ${team.bets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString()}</span>
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
    </div>
  );
}

export default TeamBetsDisplay;

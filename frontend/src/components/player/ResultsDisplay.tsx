import React, { useState, useEffect } from 'react';
import TeamBetsResult from './TeamBetsResult';
import TeamPerformanceGraph from './TeamPerformanceGraph';
import type { TeamPerformanceData } from '../../types';
import { fetchData } from '../../utils/fetch-utils';
import { Box, Stack } from '@mui/material';

interface ResultsDisplayProps {
  result?: boolean | null;
  roundCompleted?: boolean | null;
}

function ResultsDisplay({ result, roundCompleted }: ResultsDisplayProps) {
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Only fetch team performance data when round has a result AND is completed
  useEffect(() => {
    const fetchTeamPerformance = async (): Promise<void> => {
      // Don't fetch if simulation hasn't been run yet (result is undefined)
      // or if the round isn't completed
      if (result === undefined || result === null || !roundCompleted) {
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchData<TeamPerformanceData>('/api/teams/performance/');
        
        if (!data || !data.historical_data || !data.team_members) {
          throw new Error("Invalid performance data received");
        }
        
        setTeamPerformance(data);
      } catch (error) {
        console.error('Error fetching team performance:', error);
        setError("Failed to load team performance data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamPerformance();
  }, [roundCompleted, result]);
  
  // Key fix: Only show results if a simulation result exists (not undefined)
  // Otherwise show "waiting for results" screen
  if (result === undefined || result === null) {
    return (
      <div className="results-pending">
        <h2>Waiting for results...</h2>
        <p>The admin will run the simulation soon.</p>
      </div>
    );
  }
  
  return (
    <div className="results-container">
      <div className={`results ${result ? 'success' : 'failure'}`}>
        <h2>Round Results</h2>
        <div className="result-animation">
          {result ? (
            <>
              <span className="result-icon">✅</span>
              <h3>SUCCESS!</h3>
            </>
          ) : (
            <>
              <span className="result-icon">❌</span>
              <h3>FAILURE!</h3>
            </>
          )}
        </div>
        <p>Waiting for the next round to begin...</p>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading team performance data...</p>
        </div>
      )}
      
      {/*error && (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      )*/}
      
      {!loading && teamPerformance && (
        <Box display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
          {/* Team Round Results */}
            <Box margin={3}>
              <TeamBetsResult members={teamPerformance.team_members} />
            </Box>
            
            {/* Team Performance Graph */}
            <Box margin={8}>
              <TeamPerformanceGraph historicalData={teamPerformance.historical_data} />
            </Box>
        </Box>
      )}
    </div>
  );
}

export default ResultsDisplay;

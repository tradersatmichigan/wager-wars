import React from 'react';
import type { MemberPerformance } from '../../types';

interface TeamBetsResultProps {
  members: MemberPerformance[];
}

function TeamBetsResult({ members }: TeamBetsResultProps) {
  console.log("TeamBetsResult rendering with members:", members);
  
  // Sum up the team's profit
  const totalProfit = members.reduce((sum, member) => sum + member.profit, 0);
  
  // Use inline styles to ensure visibility
  const containerStyle = {
    width: '100%',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };
  
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const
  };
  
  const headerStyle = {
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'left' as const,
    padding: '10px'
  };
  
  const cellStyle = {
    padding: '10px',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'left' as const
  };
  
  const profitStyle = {
    color: '#4caf50',
    fontWeight: 'bold' as const
  };
  
  const lossStyle = {
    color: '#f44336',
    fontWeight: 'bold' as const
  };
  
  const totalRowStyle = {
    fontWeight: 'bold' as const,
    backgroundColor: 'rgba(55, 114, 255, 0.05)'
  };
  
  return (
    <div className="team-results" style={containerStyle}>
      <h3 style={{ marginTop: 0 }}>Your Team's Bets</h3>
      
      {(!members || members.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
          No team bet data available
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Player</th>
              <th style={headerStyle}>Bet Amount</th>
              <th style={headerStyle}>Profit/Loss</th>
              <th style={headerStyle}>Result</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.player_name}>
                <td style={cellStyle}>{member.player_name}</td>
                <td style={cellStyle}>${member.bet_amount.toLocaleString()}</td>
                <td style={{
                  ...cellStyle,
                  ...(member.profit >= 0 ? profitStyle : lossStyle)
                }}>
                  {member.profit >= 0 ? '+' : ''}{member.profit.toLocaleString()}
                </td>
                <td style={cellStyle}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    backgroundColor: member.result === 'won' ? 'rgba(76, 175, 80, 0.1)' : 
                                     member.result === 'lost' ? 'rgba(244, 67, 54, 0.1)' : 
                                     'rgba(0, 0, 0, 0.05)',
                    color: member.result === 'won' ? '#4caf50' : 
                           member.result === 'lost' ? '#f44336' : 
                           '#6b7280'
                  }}>
                    {member.result === 'won' ? 'Won' : 
                     member.result === 'lost' ? 'Lost' : 
                     'No Bet'}
                  </span>
                </td>
              </tr>
            ))}
            <tr style={totalRowStyle}>
              <td style={{ ...cellStyle, fontWeight: 'bold' }} colSpan={2}>Team Total P/L</td>
              <td style={{
                ...cellStyle,
                ...(totalProfit >= 0 ? profitStyle : lossStyle)
              }}>
                {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
              </td>
              <td style={cellStyle}></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TeamBetsResult;

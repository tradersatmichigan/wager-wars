import React, { useState, useEffect } from 'react';
import type { GameState, CurrentBetResponse } from '../../types';
import { fetchData, postData } from '../../utils/fetch-utils';
import { Box, Typography, TextField, Slider, Button } from '@mui/material';

interface BettingFormProps {
  gameState: GameState;
  phase: 'initial' | 'final';
}

function BettingForm({ gameState, phase }: BettingFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [lastPlacedBet, setLastPlacedBet] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load current bet when component mounts
  useEffect(() => {
    const fetchCurrentBet = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await fetchData<CurrentBetResponse>('/api/bets/current/');
        if (data.bet) {
          setAmount(data.bet.amount);
          setLastPlacedBet(data.bet.amount);
        }
      } catch (error) {
        console.error('Error fetching current bet:', error);
        setError('Failed to load your current bet');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentBet();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      await postData('/api/bets/place/', { amount });
      setLastPlacedBet(amount); // Store last placed bet
      setError(null);
    } catch (error: any) {
      console.error('Error placing bet:', error);
      setError(error.message || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClear = async () => {
    setLoading(true);
    try {
      await postData('/api/bets/place/', { amount: 0 }); // Send bet of 0 to backend
      setAmount(0);
      setLastPlacedBet(0);
      setError(null);
    } catch (error: any) {
      console.error('Error clearing bet:', error);
      setError(error.message || 'Failed to clear bet');
    } finally {
      setLoading(false);
    }
  };

  const odds = () => {
    if (!gameState.multiplier) {
      return '';
    }

    if (Number.isInteger(gameState.multiplier)) {
      return `${gameState.multiplier}:1`; // Whole numbers remain unchanged
    }
  
    const precision = 1e9; // Precision to handle floating points
    let numerator = Math.round(gameState.multiplier * precision);
    let denominator = precision;
  
    // Greatest Common Divisor function (Euclidean Algorithm)
    function gcd(a: number, b: number): number {
      return b === 0 ? a : gcd(b, a % b);
    }
  
    const divisor = gcd(numerator, denominator);
    
    // Simplify fraction
    numerator /= divisor;
    denominator /= divisor;
  
    return `${numerator}:${denominator}`;
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  
  return (
    <Box 
  sx={{ 
    backgroundColor: "#fff", 
    padding: "20px", 
    borderRadius: "1rem", 
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", 
    width: "100%",  // Matches the parent width
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  {/* Inner Wrapper to Control Width */}
  <Box width="100%">  
    {/* Header Row */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h4" fontWeight="bold" color='#3772ff'>
        {phase === 'initial' ? 'Initial Betting' : 'Final Betting'}
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="#3772ff" sx={{ textAlign: 'right' }}>
        Odds - {odds()}
      </Typography>
    </Box>
    
    <form onSubmit={handleSubmit}>
      {/* Input Field */}
      <TextField
        label="Your Bet ($)"
        type="number"
        fullWidth
        variant="outlined"
        value={amount}
        onChange={(e) => {
          const value = Math.min(Math.max(0, Number(e.target.value)), gameState.current_stack);
          setAmount(value);
        }}
        sx={{ mb: 2 }}
      />

      {/* Slider for adjusting bet */}
      <Slider
        value={amount}
        min={0}
        max={gameState.current_stack}
        step={1}
        onChange={(e, newValue) => setAmount(newValue as number)}
        sx={{
          color: "#fd8a5e"
        }}
      />

      <Box display="flex" justifyContent="space-between" mt={-1}>
        <Typography variant="body1">$0</Typography>
        <Typography variant="body1">${gameState.current_stack}</Typography>
      </Box>

      {/* Buttons */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading}
          sx={{
            fontSize: "1.25rem",
            backgroundColor: "#3772ff",
            borderRadius: "1rem"
          }}
        >
          Place Bet
        </Button>
        <Button 
          type="button" 
          variant="contained"  
          onClick={handleClear}
          disabled={loading}
          sx={{
            fontSize: "1.25rem",
            backgroundColor: "#f44336",
            borderRadius: "1rem"
          }}
        >
          Clear Bet
        </Button>
      </Box>
      
      {/* Error Message */}
      {error && (
        <Typography color="error" mt={2} textAlign="center">
          {error}
        </Typography>
      )}

      {/* Last Placed Bet */}
      {lastPlacedBet !== null && (
        <Typography variant="body1" color="textSecondary" mt={2} textAlign="center">
          Last Placed Bet: <strong>${lastPlacedBet}</strong>
        </Typography>
      )}
    </form>
  </Box>
</Box>

  );
}

export default BettingForm;

import React, { useState, useEffect } from 'react';
import type { GameState, CurrentBetResponse } from '../../types';
import { fetchData, postData } from '../../utils/fetch-utils';

interface BettingFormProps {
  gameState: GameState;
  phase: 'initial' | 'final';
}

function BettingForm({ gameState, phase }: BettingFormProps) {
  const [amount, setAmount] = useState<number>(0);
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
      setError(null);
    } catch (error: any) {
      console.error('Error placing bet:', error);
      setError(error.message || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClear = (): void => {
    setAmount(0);
  };
  
  if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
  
  return (
    <div className="betting-form">
      <h2>{phase === 'initial' ? 'Initial Betting' : 'Final Betting'}</h2>
      <p>Question: {gameState.question}</p>
      <p>Probability: {(gameState.probability ? gameState.probability * 100 : 0).toFixed(1)}%</p>
      <p>Multiplier: {gameState.multiplier}x</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Your Bet: ${amount}
            <input
              type="range"
              min="0"
              max={gameState.current_stack}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              step="10"
            />
          </label>
        </div>
        
        <div className="range-labels">
          <span>$0</span>
          <span>${gameState.current_stack}</span>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            Place Bet
          </button>
          
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear Bet
          </button>
        </div>
        
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default BettingForm;

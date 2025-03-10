import React from 'react';
import GameContainer from '../components/player/GameContainer';
import NavBar from '@/client/base';

function PlayerPage() {
  return (
    <div className="player-page container">
      <NavBar />
      <GameContainer />
    </div>
  );
}

export default PlayerPage;

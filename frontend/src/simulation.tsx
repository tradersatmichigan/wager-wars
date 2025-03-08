import { FlapDisplay, Presets } from 'react-split-flap-effect';
import CoinFlip from './CoinFlip';
import CoinSpin from './CoinSpin';

const Board = () => {
  return (
    // <FlapDisplay
    //   chars={Presets.ALPHANUM + ',!'}
    //   length={13}
    //   value={'Hello, World!'}
    // />
    <div>
      <h1>Coin Flip Game</h1>
      <CoinFlip />
    </div>
  );
}

export default Board;
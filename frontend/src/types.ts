export enum RoundPhaseEnum {
  INITIAL_BETTING = 0,
  INFORMATION = 1,
  FINAL_BETTING = 2,
  RESULTS = 3
}

export interface GameState {
  game_id: number;
  status: string;
  server_timestamp: number;
  current_round_number: number;
  round_id?: number;
  round_number?: number;
  question?: string;
  probability?: number;
  multiplier?: number;
  current_phase?: RoundPhaseEnum;
  phase_duration?: number;
  time_remaining?: number;
  result?: boolean | null;
  round_start_time?: number;
  current_stack: number;
  waiting_for_first_round?: boolean;
  waiting_for_next_round?: boolean;
  next_round_number?: number;
  game_completed?: boolean;
  rounds_completed?: number;
  round_error?: boolean;
  error_message?: string;
  round_completed?: boolean;
  team_id?: number;
  final_round: boolean;
}

export interface PlayerBet {
  player_name: string;
  amount: number;
}

export interface TeamBet {
  team_name: string;
  team_id: number;
  bets: PlayerBet[];
}

export interface TeamBetsResponse {
  timestamp: number;
  round_id: number;
  teams: TeamBet[];
}

export interface PlayerStanding {
  player_name: string;
  current_stack: number;
}

export interface TeamStanding {
  team_name: string;
  team_id: number;
  total_stack: number;
  avg_stack: number;
  players: PlayerStanding[];
}

export interface LeaderboardResponse {
  timestamp: number;
  teams: TeamStanding[];
}

export interface MemberPerformance {
  player_name: string;
  bet_amount: number;
  profit: number;
  result: 'won' | 'lost' | 'no bet';
}

export interface HistoricalDataPoint {
  round_number: number;
  team_stack: number;
  profit: number;
}

export interface TeamPerformanceData {
  team_name: string;
  team_id: number;
  current_round: number;
  round_result: boolean;
  round_profit: number;
  team_members: MemberPerformance[];
  historical_data: HistoricalDataPoint[];
}

export interface CurrentBetResponse {
  bet: {
    amount: number;
  } | null;
}

export type SimulationState = 'idle' | 'running' | 'suspense' | 'revealed' | 'result';

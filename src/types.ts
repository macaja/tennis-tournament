type Player = 'PlayerA' | 'PlayerB';

type Points = 'Love' | 'Fifteen' | 'Thirty' | 'Forty' | 'Advantage';

type GameScore =
  | { type: 'Game'; scoreA: Points; scoreB: Points }
  | { type: 'Deuce' };

type SetScore =
  | { type: 'Set'; gamesA: number; gamesB: number; currentGameScore: GameScore; previousGames: GameScore[] }
  | { type: 'TieBreak'; pointsA: number; pointsB: number };

type MatchState =
  | { type: 'InProgress'; currentSet: SetScore; previousSets: SetScore[] }
  | { type: 'Completed'; winner: Player; sets: SetScore[] };

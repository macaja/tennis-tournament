// Helper function to get the next point
function nextPoint(point: Points): Points {
switch (point) {
     case 'Love':
     return 'Fifteen';
     case 'Fifteen':
     return 'Thirty';
     case 'Thirty':
     return 'Forty';
     default:
     return 'Love';
}
}


// Function to update point score
function updatePointScore(player: Player, gameScore: GameScore): GameScore {
if (gameScore.type === 'Deuce') {
     return player === 'PlayerA'
     ? { type: 'Game', scoreA: 'Advantage', scoreB: 'Forty' }
     : { type: 'Game', scoreA: 'Forty', scoreB: 'Advantage' };
} else {
     const { scoreA, scoreB } = gameScore;
     if (player === 'PlayerA') {
     if (scoreA === 'Advantage') return { type: 'Game', scoreA: 'Love', scoreB: 'Love' };
     if (scoreA === 'Thirty' && scoreB === 'Forty') return { type: 'Deuce' }
     return { type: 'Game', scoreA: nextPoint(scoreA), scoreB };
     } else {
     if (scoreB === 'Advantage') return { type: 'Game', scoreA: 'Love', scoreB: 'Love' };
     if (scoreA === 'Forty' && scoreB === 'Thirty') return { type: 'Deuce' }
     return { type: 'Game', scoreA, scoreB: nextPoint(scoreB) };
     }
}
}

// Function to update game score
function updateGameScore(player: Player, setScore: SetScore): SetScore {
if (setScore.type === 'Set') {
     const { gamesA, gamesB, currentGameScore, previousGames } = setScore;
     if (player === 'PlayerA') {
     if (gamesA === 6 && gamesB === 6) return { type: 'TieBreak', pointsA: 0, pointsB: 0 };
     return { type: 'Set', gamesA: gamesA + 1, gamesB, currentGameScore, previousGames };
     } else {
     if (gamesA === 6 && gamesB === 6) return { type: 'TieBreak', pointsA: 0, pointsB: 0 };
     return { type: 'Set', gamesA, gamesB: gamesB + 1, currentGameScore, previousGames };
     }
} else {
     const { pointsA, pointsB } = setScore;
     return player === 'PlayerA'
     ? { type: 'TieBreak', pointsA: pointsA + 1, pointsB }
     : { type: 'TieBreak', pointsA, pointsB: pointsB + 1 }
}
}
// Helper functions to check if the set or match is won
function isSetWon(player: Player, setScore: SetScore): boolean {
if (setScore.type === 'Set') {
     const { gamesA, gamesB } = setScore;
     return (
     (player === 'PlayerA' && (gamesA === 6 && gamesB <= 4 || gamesA === 7)) ||
     (player === 'PlayerB' && (gamesB === 6 && gamesA <= 4 || gamesB === 7))
     );
} else {
     const { pointsA, pointsB } = setScore;
     return (player === 'PlayerA' && pointsA >= 7 && pointsA - pointsB >= 2) ||
     (player === 'PlayerB' && pointsB >= 7 && pointsB - pointsA >= 2);
}
}

function isMatchWon(winner: Player, currentSet: SetScore, previousSets: SetScore[]): boolean {
const setsWon = previousSets.reduce(
     (acc, set) => {
     if (isSetWon('PlayerA', set)) acc.playerA++;
     if (isSetWon('PlayerB', set)) acc.playerB++;
     return acc;
     },
     { playerA: 0, playerB: 0 }
);

if (isSetWon(winner, currentSet)) {
     if (winner === 'PlayerA') setsWon.playerA++;
     if (winner === 'PlayerB') setsWon.playerB++;
}

return setsWon.playerA >= 3 || setsWon.playerB >= 3;
}

export function playPoint(winner: Player, matchState: MatchState): MatchState {
if (matchState.type === 'InProgress') {
     const { currentSet, previousSets } = matchState;
     if(currentSet.type === 'Set'){
     const { gamesA, gamesB, currentGameScore, previousGames } = currentSet
     const updatedGameScore = updatePointScore(winner, currentGameScore);
     if (updatedGameScore.type === 'Game' && updatedGameScore.scoreA === 'Love' && updatedGameScore.scoreB === 'Love') {
          const updatedSetScore = updateGameScore(winner, currentSet);
          if (isSetWon(winner, updatedSetScore)) {
          if (isMatchWon(winner, updatedSetScore, previousSets)) {
          return { type: 'Completed', winner, sets: [...previousSets, updatedSetScore] };
          } else {
          return { type: 'InProgress', currentSet: { type: 'Set', gamesA: 0, gamesB: 0, currentGameScore:updatedGameScore, previousGames: [...previousGames, updatedGameScore]}, previousSets: [...previousSets, updatedSetScore] };
          }
          } else {
          return { type: 'InProgress', currentSet: updatedSetScore, previousSets };
          }
     } else {
          return { type: 'InProgress', currentSet: { type: 'Set', gamesA: gamesA, gamesB: gamesB, currentGameScore:updatedGameScore, previousGames: [...previousGames, updatedGameScore]}, previousSets };
     }
     } else {
     return { type: 'InProgress', currentSet: currentSet, previousSets };
     }
} else {
     return matchState;
}
}
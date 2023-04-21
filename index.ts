import * as fs from 'fs'
import { playPoint } from './src/matchService';
export interface Match {
  matchId: string;
  playerA: string;
  playerB: string;
  points: string[];
}

function playerThatWon(point: string): Player {
  return point === '0' ? 'PlayerA' : 'PlayerB'
} 

export function runMatchBasedOnPoints(): void {
  const match: Match = {
    matchId: 'Match: 01',
    playerA: 'Juan',
    playerB: 'David',
    points: ['0','1','0','1','0','1','0','0']
  }
  const initialGameScore: GameScore = {
    type:'Game',
    scoreA: 'Love',
    scoreB: 'Love'
  }
  const initialSetScore: SetScore = {
    type: 'Set',
    gamesA: 0,
    gamesB: 0,
    currentGameScore: initialGameScore,
    previousGames: []
  }
  const initialMatchState: MatchState = {
    type: 'InProgress',
    currentSet: initialSetScore,
    previousSets: []
  }
  const matchResults = match.points.map(playerThatWon).reduce<MatchState>((acc, player) => {
    return playPoint(player, acc)
  }, initialMatchState)
  return console.log(JSON.stringify(matchResults))
}

function processFile(): void {
  const initialGameScore: GameScore = {
    type:'Game',
    scoreA: 'Love',
    scoreB: 'Love'
  }
  const initialSetScore: SetScore = {
    type: 'Set',
    gamesA: 0,
    gamesB: 0,
    currentGameScore: initialGameScore,
    previousGames: []
  }
  const initialMatchState: MatchState = {
    type: 'InProgress',
    currentSet: initialSetScore,
    previousSets: []
  }
  const file = process.argv.slice(2).toString()
  const readStream = fs.createReadStream(file, { encoding: 'utf8'} )
  let matchState: MatchState = initialMatchState
  readStream.on('data', (chunk: string) => {
    console.log("chunk value: " + chunk)
    const list = chunk.split(/\r?\n/);
    console.log("points: " + list)
    // matchState = points.map(playerThatWon).reduce<MatchState>((acc, player) => {
    //   console.log("player is: " + player)
    //   return playPoint(player, acc)
    // }, initialMatchState)
  });
  readStream.on('end', () => {
    console.log('match result:' + JSON.stringify(matchState))
  })
  readStream.on('error', (error:Error) => {
    console.log("error loading file: " + error)
  })
}

processFile();
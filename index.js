"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMatchBasedOnPoints = void 0;
const fs = __importStar(require("fs"));
const matchService_1 = require("./src/matchService");
function playerThatWon(point) {
    return point === '0' ? 'PlayerA' : 'PlayerB';
}
function runMatchBasedOnPoints() {
    const match = {
        matchId: 'Match: 01',
        playerA: 'Juan',
        playerB: 'David',
        points: ['0', '1', '0', '1', '0', '1', '0', '0']
    };
    const initialGameScore = {
        type: 'Game',
        scoreA: 'Love',
        scoreB: 'Love'
    };
    const initialSetScore = {
        type: 'Set',
        gamesA: 0,
        gamesB: 0,
        currentGameScore: initialGameScore,
        previousGames: []
    };
    const initialMatchState = {
        type: 'InProgress',
        currentSet: initialSetScore,
        previousSets: []
    };
    const matchResults = match.points.map(playerThatWon).reduce((acc, player) => {
        return (0, matchService_1.playPoint)(player, acc);
    }, initialMatchState);
    return console.log(JSON.stringify(matchResults));
}
exports.runMatchBasedOnPoints = runMatchBasedOnPoints;
function processFile() {
    const initialGameScore = {
        type: 'Game',
        scoreA: 'Love',
        scoreB: 'Love'
    };
    const initialSetScore = {
        type: 'Set',
        gamesA: 0,
        gamesB: 0,
        currentGameScore: initialGameScore,
        previousGames: []
    };
    const initialMatchState = {
        type: 'InProgress',
        currentSet: initialSetScore,
        previousSets: []
    };
    const file = process.argv.slice(2).toString();
    const readStream = fs.createReadStream(file, { encoding: 'utf8' });
    let matchState = initialMatchState;
    readStream.on('data', (chunk) => {
        console.log("chunk value: " + chunk);
        const list = chunk.split(/\r?\n/);
        console.log("points: " + list);
        // matchState = points.map(playerThatWon).reduce<MatchState>((acc, player) => {
        //   console.log("player is: " + player)
        //   return playPoint(player, acc)
        // }, initialMatchState)
    });
    readStream.on('end', () => {
        console.log('match result:' + JSON.stringify(matchState));
    });
    readStream.on('error', (error) => {
        console.log("error loading file: " + error);
    });
}
processFile();

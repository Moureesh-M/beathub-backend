require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

function collectStages(node, stages = []) {
  if (!node || typeof node !== 'object') {
    return stages;
  }

  if (node.stage) {
    stages.push(node.stage);
  }

  for (const key of Object.keys(node)) {
    collectStages(node[key], stages);
  }

  return stages;
}

function summarizeExplain(label, explainResult) {
  const stages = collectStages(explainResult.queryPlanner.winningPlan);
  const hasCollscan = stages.includes('COLLSCAN');
  const hasIxscan = stages.includes('IXSCAN');
  const stats = explainResult.executionStats;

  console.log(`\n${label}`);
  console.log(`  Stage Summary: ${hasIxscan ? 'IXSCAN' : 'NO IXSCAN'}${hasCollscan ? ' + COLLSCAN' : ''}`);
  console.log(`  totalDocsExamined: ${stats.totalDocsExamined}`);
  console.log(`  totalKeysExamined: ${stats.totalKeysExamined}`);
  console.log(`  nReturned: ${stats.nReturned}`);
}

async function runTests() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log('\nRunning explain("executionStats") benchmarks...');

  const q1 = await Song.find({ genre: 'Electronic' })
    .sort({ duration: -1 })
    .explain('executionStats');
  summarizeExplain('Q1: Songs by genre sorted by duration', q1);

  const q2 = await Song.find({ releaseYear: { $gt: 2015 } })
    .sort({ releaseYear: -1 })
    .explain('executionStats');
  summarizeExplain('Q2: Songs by releaseYear range sorted by releaseYear', q2);

  const playlist = await Playlist.findOne();
  const q3 = await Playlist.find({ user: playlist.user }).explain('executionStats');
  summarizeExplain('Q3: Playlists by user', q3);

  const randomSong = await Song.findOne();
  if (randomSong) {
    const q4 = await Song.find({ artist: randomSong.artist })
      .sort({ plays: -1 })
      .explain('executionStats');
    summarizeExplain('Q4: Songs by artist sorted by plays', q4);
  }

  const q5 = await User.find({ loginCount: { $gt: 100 } }).explain('executionStats');
  summarizeExplain('Q5: Users with high loginCount', q5);

  console.log('\nPerformance test completed.');

  await mongoose.disconnect();

  process.exit(0);
}

runTests();
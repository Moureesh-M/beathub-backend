require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const User = require('../models/User');
const Playlist = require('../models/Playlist');

const genres = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Jazz'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return faker.number.int({ min, max });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      Artist.deleteMany({}),
      Album.deleteMany({}),
      Song.deleteMany({}),
      User.deleteMany({}),
      Playlist.deleteMany({})
    ]);

    console.log('Old data cleared');

    // 1️⃣ Artists
    const artistData = [];
    for (let i = 0; i < 30; i++) {
      artistData.push({
        name: faker.person.fullName(),
        genre: randomItem(genres),
        bio: faker.lorem.paragraph()
      });
    }
    const artists = await Artist.insertMany(artistData);

    // 2️⃣ Albums
    const albumData = [];
    for (let i = 0; i < 100; i++) {
      albumData.push({
        title: faker.music.songName(),
        releaseYear: faker.number.int({ min: 1990, max: 2026 }),
        artist: randomItem(artists)._id
      });
    }
    const albums = await Album.insertMany(albumData);

    // 3️⃣ Songs
    const songData = [];
    for (let i = 0; i < 2000; i++) {
      songData.push({
        title: faker.music.songName(),
        duration: randomInt(120, 420),
        genre: randomItem(genres),
        releaseYear: faker.number.int({ min: 1990, max: 2026 }),
        plays: randomInt(0, 500000),
        artist: randomItem(artists)._id,
        album: randomItem(albums)._id
      });
    }
    const songs = await Song.insertMany(songData);

    // 4️⃣ Users
    const userData = [];
    for (let i = 0; i < 200; i++) {
      userData.push({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 16 }),
        loginCount: randomInt(0, 5000)
      });
    }
    const users = await User.insertMany(userData);

    // 5️⃣ Playlists
    const playlistData = [];
    for (let i = 0; i < 400; i++) {
      const randomSongs = [];
      for (let j = 0; j < 15; j++) {
        randomSongs.push(randomItem(songs)._id);
      }

      playlistData.push({
        name: faker.music.genre() + ' Mix ' + faker.string.alphanumeric(5),
        description: faker.lorem.sentence(),
        user: randomItem(users)._id,
        songs: randomSongs
      });
    }

    await Playlist.insertMany(playlistData);

    console.log('Database seeded successfully!');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3005;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb+srv://z8570:7DBcuBvX@cluster0.lbr0l24.mongodb.net/gamesdb?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Verbonden met MongoDB Atlas'))
  .catch(err => console.error('❌ Verbindingsfout:', err));

const gameSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number
});
const Game = mongoose.model('Game', gameSchema);

app.get('/games', async (req, res) => {
  const search = req.query.q || '';
  try {
    const games = await Game.find({ title: new RegExp(search, 'i') });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Fout bij zoeken' });
  }
});

app.post('/games', async (req, res) => {
  const { title, genre, rating } = req.body;

  if (!title || !genre || !rating) {
    return res.status(400).json({ error: 'Vul alle velden in' });
  }

  try {
    const game = new Game({ title, genre, rating });
    await game.save();
    res.status(201).json({ message: 'Game toegevoegd', game });
  } catch (err) {
    res.status(500).json({ error: 'Fout bij opslaan' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server draait op http://localhost:${port}`);
});
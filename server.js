const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use(express.json());

const usersFilePath = path.join(__dirname, 'server-side', 'users.json');
const gamesFilePath = path.join(__dirname, 'server-side', 'games.json');
const rankingFilePath = path.join(__dirname, 'server-side', 'ranking.json');

function generateHash(value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

function writeToJSONFile(data, path) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

app.post('/register', (req, res) => {
  const data = req.body;
  const nick = data.nick;
  const password = data.password;
  const users = JSON.parse(fs.readFileSync(usersFilePath));
  const existingUser = users.find(user => user.nick === nick);

  if (existingUser) {
    if (existingUser.password === generateHash(password)) {
      return res.status(200).json({ message: 'Registrado com sucesso.' });
    } else {
      return res.status(400).json({ error: 'Nick já registrado com outra password.' });
    }
  }
  for (let j = 0; j < nick.length; j++){
    if (!nick.charAt(j).match(/[a-z]/i)) {
      return res.status(400).json({ error: 'Nick tem que ser uma string.' });
    }
  }
  for (let j = 0; j < password.length; j++){
    if (!password.charAt(j).match(/[a-z]/i)) {
      return res.status(400).json({ error: 'Password tem que ser uma string.' });
    }
  }
  if (nick == '') return res.status(400).json({ error: 'Nick tem que ser uma string.' });
  if (password == '') return res.status(400).json({ error: 'Password tem que ser uma string.' });

  const hashedPassword = generateHash(password);
  const newUser = { nick, password: hashedPassword };
  users.push(newUser);
  writeToJSONFile(users, usersFilePath);
  res.status(200).json({ message: 'Registrado com sucesso.' });
});

app.post('/ranking', (req, res) => {
  const data = req.body;
  const size = data.size;
  const state = data.state;
  const nick = data.nick;
  const columns = size.columns;
  const ranking = JSON.parse(fs.readFileSync(rankingFilePath));
  const existingRanking = ranking.find(entry => entry.size.columns === columns);
  const existingRankingIndex = ranking.findIndex(entry => {
    return entry.size.rows === 6 && entry.size.columns === 5 && entry.users.some(user => user.nick === nick);
  });

if (state == 'info') return res.status(200).json({ ranking });
if (existingRankingIndex === -1 && state == 'game') {
    ranking[0].users.push({
      nick: nick,
      games_played: 1,
      victories: 0
    });
    fs.writeFileSync(rankingFilePath, JSON.stringify(ranking, null, 2));
}
  else if (state == 'game' && existingRanking) {
    if (columns == existingRanking.size.columns) {
      const played = existingRanking.users.find(user => user.nick === nick);
      if (played) {
        played.games_played = (parseInt(played.games_played) || 0) + 1;
        fs.writeFileSync(rankingFilePath, JSON.stringify(ranking, null, 2));
    }
  }
}
else if (state == 'end' && existingRanking) {
  if (columns == existingRanking.size.columns) {
    const victory = existingRanking.users.find(user => user.nick === nick);
    if (victory) {
      victory.victories = (parseInt(victory.victories) || 0) + 1;
      fs.writeFileSync(rankingFilePath, JSON.stringify(ranking, null, 2));
  }
}
}
res.status(200).json({ ranking });
});


const port = process.env.PORT || 8127;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

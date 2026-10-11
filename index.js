const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const router = express.Router();


app.use(express.json());


router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});


router.get('/profile', (req, res, next) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) return next(err);
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      next(parseErr);
    }
  });
});


router.post('/login', (req, res, next) => {
  const { username, password } = req.body || {};

  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) return next(err);

    let user;
    try {
      user = JSON.parse(data);
    } catch (parseErr) {
      return next(parseErr);
    }

    if (username !== user.username) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }
    if (password !== user.password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }
    res.json({ status: true, message: 'User Is valid' });
  });
});


router.get(['/logout/:username', '/logout'], (req, res) => {
  const username = req.params.username || req.query.username;
  res.send(`<b>${username} successfully logged out.</b>`);
});

// Mount the router
app.use('/', router);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.listen(process.env.port || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.port || 8081));
});

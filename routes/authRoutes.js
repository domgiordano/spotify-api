global.access_token = "";
global.refresh_token = "";
const express = require('express');
const { access } = require('fs');
const { token } = require('morgan');
const router = express.Router();
const app = express();
//const fetch = require('node-fetch');
const path = require('path');
const querystring = require('querystring');

// this can be used as a seperate module
const encodeFormData = (data) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

module.exports = router;

router.get('/home', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
});
router.get('/login', async (req, res) => {
    const scope =
      `user-modify-playback-state
      user-read-playback-state
      user-read-currently-playing
      user-library-modify
      user-library-read
      user-top-read
      playlist-read-private
      playlist-modify-public`;

    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECTURI
      })
    );
  });

  router.get('/logged', async (req, res) => {
    const body = {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: process.env.REDIRECTURI,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    }

    await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: encodeFormData(body)
    })
    .then(response => response.json())
    .then(data => {
      const query = querystring.stringify(data);
      const access_token = data['access_token'];
      const refresh_token = data['refresh_token'];

      app.set('access_token', access_token);
      app.set('refresh_token', refresh_token);
      console.log(app.get('access_token'));

      res.sendFile(path.join(__dirname, '..', 'html', 'home.html'));
      //res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);
    });
  });

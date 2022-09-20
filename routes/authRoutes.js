let access_token = "";
let refresh_token = "";
const express = require('express');
const fs = require('fs');
const { data } = require('jquery');
//const { access } = require('fs');
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

async function loadUserSongs(offset) {
  let i = 0;
  do {
    i++;
    console.log("load user songs");
    let maxSongs = 50;
    let url = 'https://api.spotify.com/v1/me/tracks?limit='+ maxSongs + '&offset=' + i * maxSongs;
    console.log(url)
    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();

    if(data.items.length === 0){
      console.log("no mas bros");
      break;
    }

    fs.appendFile(path.join(__dirname, '..', 'json', 'userSongs.json'), JSON.stringify(data.items), 'utf8', err=> {
      if(err){
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file.")
      }
    });
    console.log('i: ' + i);
  } while(true);

  return;

}


router.get('/load', async (req, res) => {

  //res.sendFile(path.join(__dirname, '..', 'html', 'load.html'));
  console.log("Loading (stealing) your songs (data)...")
  let result = await loadUserSongs(0);
  res.redirect(`${process.env.USERURI}?access_token=${access_token}&refresh_token=${refresh_token}`);

});

router.get('/home', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
});

router.get('/user', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'user.html'));
});

router.get('/songs', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'songs.html'));
});

router.get('/artists', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'artists.html'));
});

router.get('/genres', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'genres.html'));
});

router.get('/playlist', async (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'playlist.html'));
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
      access_token = data['access_token'];
      refresh_token = data['refresh_token'];

      module.exports.access_token = data['access_token'];
      module.exports.refresh_token = data['refresh_token'];
      app.set('access_token', access_token);
      app.set('refresh_token', refresh_token);
      console.log(app.get('access_token'));

      //res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);

      //res.sendFile(path.join(__dirname, '..', 'html', 'home.html'));
      res.redirect(`${process.env.LOADURI}?access_token=${access_token}&refresh_token=${refresh_token}`);
    });


  });

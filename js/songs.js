const CLIENT_ID = '7423d0c507234bb5bf8fbd97cdf921bb'
const CLIENT_SECRET = 'cd9d07c6a829494b934cba03abbe96e6'


export const renderPage = function() {
    return `<section class="hero is-success is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head has-background-black-bis">
      <header class="navbar">
        <div class="container has-background-black-bis">
          <div id="navbarMenuHeroC" class="navbar-menu has-background-black-bis">
            <div class="navbar-start">
              <a class="navbar-item is-active" onclick="window.open('home.html', '_self')">
                Home
              </a>
              <a class="navbar-item" onclick="window.open('songs.html', '_self')">
                Top Songs
              </a>
              <a class="navbar-item" onclick="window.open('artists.html', '_self')">
                Top Artists
              </a>
              <a class="navbar-item" onclick="window.open('genres.html', '_self')">
                Top Genres
              </a>
              <a class="navbar-item" onclick="window.open('playlist.html', '_self')">
                Playlist aGenerator
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container has-text-centered">
        <p class="title is-1">
          ${getSongs(getToken())}
        </p>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
    </div>
  </section>`
  };

  export const getToken = async () => {
    const express = require('express');
    const app = express();
    var token = app.get('access_token')
    return token;
}
  export const getSongs = async (token) => {
      const limit = 25;

      return fetch(`https://api.spotify.com/v1/me/top/tracks`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      })
      /* const result = await fetch(`https://api.spotify.com/v1/me/top/tracks`, {
          method: 'GET',
          headers: { 'Authorization' : ' Bearer ' + token}
      });

      const data = await result.json();
      return data.items; */
  }

  export const loadPage = function() {

    const $root = $('#root');


    $root.append(renderPage());
  };


  $(function() {
    loadPage();
  });

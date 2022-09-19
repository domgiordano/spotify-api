let access_token = "";
let refresh_token = "";

export const renderPage = function() {
    return `<section class="hero is-success is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head has-background-black-bis">
      <header class="navbar">
        <div class="container has-background-black-bis">
          <div id="navbarMenuHeroC" class="navbar-menu has-background-black-bis">
            <div class="navbar-start">
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/user?access_token=${access_token}&refresh_token=${refresh_token}'">
              Home
            </a>
            <a class="navbar-item is-active" onclick="location.href='http://localhost:8080/api/songs?access_token=${access_token}&refresh_token=${refresh_token}'">
              Top Songs
            </a>
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/artists?access_token=${access_token}&refresh_token=${refresh_token}'">
              Top Artists
            </a>
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/genres?access_token=${access_token}&refresh_token=${refresh_token}'">
              Top Genres
            </a>
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/playlist?access_token=${access_token}&refresh_token=${refresh_token}'">
              Playlist Generator
            </a>
          </div>
          </div>
        </div>
      </header>
    </div>

    <div class="hero-body">
      <div id="main" class="container has-text-centered">
        <p class="title is-1">
        </p>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
    </div>
  </section>`
  };

  export const getToken = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    access_token = urlParams.get('access_token');
    refresh_token = urlParams.get('refresh_token');
    console.log(access_token + " : " + refresh_token)
    return;
  }

  async function getSongs(maxSongs = 50) {
    let songInfo = '<p class="title" style="text-align: center"> YOUR TOP SPOTIFY SONGS: </p>'
    const url = 'https://api.spotify.com/v1/me/top/tracks?limit='+ maxSongs;
    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();

    songInfo+='<div class="columns is-multiline" style="margin-left: 0.025%">';
    for(let i = 1; i < maxSongs + 1; i++){
        let songName = data.items[i-1].name;
        let songArtists = "";
        for(let j = 0; j < data.items[i-1].artists.length; j++){
          if (j == 0) {
            songArtists += data.items[i-1].artists[j].name;
          }
          else if (j == 1) {
            songArtists += " ft. " + data.items[i-1].artists[j].name;
          }
          else {
            songArtists += " & " + data.items[i-1].artists[j].name;
          }
        }
        songInfo+='<div class="column is-one-quarter" style="margin: 1%; width: 31%">';
        songInfo+='<div class="card-content" style="text-align: center">';
        songInfo+='<div class="card-image"  style="background: white">';
        songInfo+='<figure class="image"><img src="' + data.items[i-1].album.images[0].url + '" alt="Placeholder image"></figure>';
        songInfo+='</div>';
        songInfo+='<div class="media">';
        songInfo+='<div class="media-content" ><p class="title is-4" style=" text-align: center">'+ i + ': ' + songName + '</p>';
        songInfo+='<p class="subtitle is-6" style="text-align: center">' + songArtists + '</p>';
        songInfo+='</div></div></div></div>';


        /* songInfo += '<div class="tile is-parent>';
        songInfo += '<article class="tile is-child box"><img src="' + data.items[i-1].album.images[0].url + '" width="100" height="100" alt="Placeholder image">'
        songInfo += '<p class="subtitle style="text-align: center">'+ i + ': ' + songName + ' by ' + songArtists + ' </p></article>';
        songInfo += '</div>'; */

    }

    songInfo+='</div>';

    $('#main').append(songInfo);
  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());
  };


  $(function() {
    getToken();
    loadPage();
    getSongs();
  });

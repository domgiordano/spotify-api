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
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/songs?access_token=${access_token}&refresh_token=${refresh_token}'">
              Top Songs
            </a>
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/artists?access_token=${access_token}&refresh_token=${refresh_token}'">
              Top Artists
            </a>
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/genres?access_token=${access_token}&refresh_token=${refresh_token}'">
              Top Genres
            </a>
            <a class="navbar-item is-active" onclick="location.href='http://localhost:8080/api/playlist?access_token=${access_token}&refresh_token=${refresh_token}'">
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
            Select Your Filters
        </p>
        <br>
        <p class="subtitle is-6" style="text-align: center"> Dancability Value: <span id="danceVal"></span></p>
        <input id="danceSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value=".50" type="range">

        <br>
        <p class="subtitle is-6" style="text-align: center"> Loudness Value: <span id="loudVal"></span></p>
        <input id="loudSlider" class="slider has-output-tooltip is-fullwidth" step="1" min="-60" max="0" value="-30" type="range">

        <br>
        <p class="subtitle is-6" style="text-align: center"> Tempo Value: <span id="tempoVal"></span></p>
        <input id="tempoSlider" class="slider has-output-tooltip is-fullwidth" step="10" min="0" max="200" value="100" type="range">

        <br>
        <p class="subtitle is-6" style="text-align: center"> Energy Value: <span id="energyVal"></span></p>
        <input id="energySlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value=".50" type="range">

        <br>
        <button id="playlistBtn" class="button is-link is-light is-large is-outlined is-rounded">
          SUBMIT
        </button>
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

  async function getSongs(danceVal=-50, tempoVal=-50, loudVal=-50, energyVal=-50) {
    const maxSongs = 50;
    let playlistSongCount=0;
    let songInfo = ''
    let songIds = [];
    const url = 'https://api.spotify.com/v1/me/tracks?limit='+ maxSongs;
    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();
    console.log(data)
    songInfo+='<div id="playlistSongs" class="columns is-multiline" style="margin-left: 0.025%">';
    for(let i = 1; i < maxSongs + 1; i++){
        let songName = data.items[i-1].track.name;
        let songArtists = "";
        for(let j = 0; j < data.items[i-1].track.artists.length; j++){
          if (j == 0) {
            songArtists += data.items[i-1].track.artists[j].name;
          }
          else if (j == 1) {
            songArtists += " ft. " + data.items[i-1].track.artists[j].name;
          }
          else {
            songArtists += " & " + data.items[i-1].track.artists[j].name;
          }
        }

        const songURL = 'https://api.spotify.com/v1/audio-features/' + data.items[i-1].track.id;
        const songResponse = await fetch(songURL, { headers });
        const songData = await songResponse.json();


        if (songData.energy > energyVal && songData.danceability > danceVal && songData.tempo > tempoVal && songData.loudness > loudVal){
            playlistSongCount++;
            songInfo+='<div class="column is-one-quarter" style="margin: 1%; width: 31%">';
            songInfo+='<div class="card-content" style="text-align: center">';
            songInfo+='<div class="card-image"  style="background: white">';
            songInfo+='<figure class="image"><img src="' + data.items[i-1].track.album.images[0].url + '" alt="Placeholder image"></figure>';
            songInfo+='</div>';
            songInfo+='<div class="media">';
            songInfo+='<div class="media-content" ><p class="title is-4" style=" text-align: center">'+ playlistSongCount + ': ' + songName + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center">' + songArtists + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> ENERGY: ' + songData.energy + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> DANCEABILITY: ' + songData.danceability + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> TEMPO: ' + songData.tempo + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> LOUDNESS: ' + songData.loudness + '</p>';
            songInfo+='</div></div></div></div>';
        }
        songIds[i-1] = data.items[i-1].track.id


        /* songInfo += '<div class="tile is-parent>';
        songInfo += '<article class="tile is-child box"><img src="' + data.items[i-1].album.images[0].url + '" width="100" height="100" alt="Placeholder image">'
        songInfo += '<p class="subtitle style="text-align: center">'+ i + ': ' + songName + ' by ' + songArtists + ' </p></article>';
        songInfo += '</div>'; */

    }

    songInfo+='</div>';
    console.log(songIds)
    let playlist = document.getElementById("playlistSongs");
    if (playlist){
        //playlist.innerHTML = '';
        playlist.remove();
    }
    $('#main').append(songInfo);
  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());

    var danceSlider = document.getElementById("danceSlider");
    var tempoSlider = document.getElementById("tempoSlider");
    var loudSlider = document.getElementById("loudSlider");
    var energySlider = document.getElementById("energySlider");

    var danceVal = document.getElementById("danceVal");
    var tempoVal = document.getElementById("tempoVal");
    var loudVal = document.getElementById("loudVal");
    var energyVal = document.getElementById("energyVal");

    danceVal.innterHTML = danceSlider.nodeValue;
    tempoVal.innterHTML = tempoSlider.nodeValue;
    loudVal.innterHTML = loudSlider.nodeValue;
    energyVal.innerHTML = energySlider.nodeValue;

    danceSlider.oninput = function() {
        danceVal.innerHTML = this.value;
    }
    tempoSlider.oninput = function() {
        tempoVal.innerHTML = this.value;
    }
    loudSlider.oninput = function() {
        loudVal.innerHTML = this.value;
    }
    energySlider.oninput = function() {
        energyVal.innerHTML = this.value;
    }

    $(document).ready(function() {
        $("#playlistBtn").click(function(){
            getSongs(danceSlider.value, tempoSlider.value, loudSlider.value, energySlider.value);
        });
    });

  };


  $(function() {
    getToken();
    loadPage();


    //getSongs();
  });

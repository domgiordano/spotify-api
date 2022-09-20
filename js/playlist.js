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
        <p class="title is-1">Select Filters</p>
        <div class="columns is-multiline">
            <div class="column is-one-quarter">
                <p class="subtitle is-6" style="text-align: center"> Dancability Value: <span id="danceVal"> 0 </span> to <span id="danceValMax"> 1.00 </span></p>
                MIN: <input id="danceSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX: <input id="danceSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-6" style="text-align: center"> Loudness Value: <span id="loudVal"> -60 </span> to <span id="loudValMax"> 0.00 </span></p>
                MIN: <input id="loudSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="-60.00" max="0.00" value="-60.00" type="range"><br>
                MAX: <input id="loudSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="-60.00" max="0.00" value="0.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-6" style="text-align: center"> Tempo Value: <span id="tempoVal"> 0 </span> to <span id="tempoValMax"> 200 </span></p>
                MIN: <input id="tempoSlider" class="slider has-output-tooltip is-fullwidth" step="1" min="0" max="200" value="0" type="range"><br>
                MAX: <input id="tempoSliderMax" class="slider has-output-tooltip is-fullwidth" step="1" min="0" max="200" value="200" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-6" style="text-align: center"> Energy Value: <span id="energyVal"> 0 </span> to <span id="energyValMax"> 1.00 </span></p>
                MIN <input id="energySlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX <input id="energySliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-6" style="text-align: center"> Speechiness Value: <span id="speechVal"> 0 </span> to <span id="speechValMax"> 1.00 </span></p>
                MIN: <input id="speechSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX: <input id="speechSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-6" style="text-align: center"> Valence Value: <span id="valenceVal"> 0 </span> to <span id="valenceValMax"> 1.00 </span></p>
                MIN: <input id="valenceSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX: <input id="valenceSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
        </div>
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

  async function getSongs(filterVals, offset) {

    //Check filter values
    if(filterVals['energyMin'] >= filterVals['energyMax']){
        alert("Invalid Energy Values. Try again.")
        return;
    }
    if(filterVals['danceMin'] >= filterVals['danceMax']){
        alert("Invalid Dancability Values. Try again.")
        return;
    }
    if(filterVals['tempoMin'] >= filterVals['tempoMax']){
        alert("Invalid Tempo Values. Try again.")
        return;
    }
    if(filterVals['loudMin'] >= filterVals['loudMax']){
        alert("Invalid Loudness Values. Try again.")
        return;
    }
    if(filterVals['speechMin'] >= filterVals['speechMax']){
        alert("Invalid Speechiness Values. Try again.")
        return;
    }
    if(filterVals['valenceMin'] >= filterVals['valenceMax']){
        alert("Invalid Valence Values. Try again.")
        return;
    }

    const maxSongs = 50;
    let playlistSongCount=0;
    let songInfo = ''
    if(offset == 0) {
        songInfo+='<div id="cardGroup" class="columns is-multiline" style="margin-left: 0.025%">';
    }
    let songIds = [];
    const url = 'https://api.spotify.com/v1/me/tracks?limit='+ maxSongs + '&offset=' + (offset * maxSongs);
    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();
    console.log(data);
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


        if (songData.energy > filterVals['energyMin'] && songData.energy < filterVals['energyMax'] &&
                songData.danceability > filterVals['danceMin'] && songData.danceability < filterVals['danceMax'] &&
                songData.tempo > filterVals['tempoMin'] && songData.tempo < filterVals['tempoMax'] &&
                songData.loudness > filterVals['loudMin'] && songData.loudness < filterVals['loudMax'] &&
                songData.speechiness > filterVals['speechMin'] && songData.speechiness < filterVals['speechMax'] &&
                songData.valence > filterVals['valenceMin'] && songData.valence < filterVals['valenceMax']){

            playlistSongCount++;
            songInfo+='<div class="column is-one-quarter" style="margin: 1%; width: 31%">';
            songInfo+='<div class="card-content" style="text-align: center">';
            songInfo+='<div class="card-image"  style="background: white">';
            songInfo+='<figure class="image"><img src="' + data.items[i-1].track.album.images[0].url + '" alt="Placeholder image"></figure>';
            songInfo+='</div>';
            songInfo+='<div class="media">';
            songInfo+='<div class="media-content" ><p class="title is-4" style=" text-align: center">'+ (playlistSongCount + (offset * maxSongs)) + ': ' + songName + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center">' + songArtists + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> ENERGY: ' + songData.energy + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> DANCEABILITY: ' + songData.danceability + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> TEMPO: ' + songData.tempo + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> LOUDNESS: ' + songData.loudness + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> TEMPO: ' + songData.speechiness + '</p>';
            songInfo+='<p class="subtitle is-6" style="text-align: center"> LOUDNESS: ' + songData.valence + '</p>';
            songInfo+='</div></div></div></div>';
        }
        songIds[i-1] = data.items[i-1].track.id


    }

    songInfo+='</div>';
    console.log(songIds)
    let moreButton = document.getElementById("moreBtn");
    let resetButton = document.getElementById("resetBtn");
    let buttonInfo ='<div><button id="moreBtn" class="button is-link is-light is-large is-outlined is-rounded"> Gimme more my guy </button><button id="resetBtn" class="button is-warning is-light is-large is-outlined is-rounded"> Reset Page pls. </button></div>';
    if (offset != 0){
        //playlist.innerHTML = '';
        moreButton.remove();
        resetButton.remove();
        $('#cardGroup').append(songInfo);
    }
    else{
      songInfo+='</div>';
      $('#main').append(songInfo);
    }

    $('#main').append(buttonInfo);

    /* let playlist = document.getElementById("playlistSongs");
    if (playlist){
        //playlist.innerHTML = '';
        playlist.remove();
    } */

  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());

    var danceSlider = document.getElementById("danceSlider");
    var tempoSlider = document.getElementById("tempoSlider");
    var loudSlider = document.getElementById("loudSlider");
    var energySlider = document.getElementById("energySlider");
    var speechSlider = document.getElementById("speechSlider");
    var valenceSlider = document.getElementById("valenceSlider");
    var danceSliderMax = document.getElementById("danceSliderMax");
    var tempoSliderMax = document.getElementById("tempoSliderMax");
    var loudSliderMax = document.getElementById("loudSliderMax");
    var energySliderMax = document.getElementById("energySliderMax");
    var speechSliderMax = document.getElementById("speechSliderMax");
    var valenceSliderMax = document.getElementById("valenceSliderMax");

    var danceVal = document.getElementById("danceVal");
    var tempoVal = document.getElementById("tempoVal");
    var loudVal = document.getElementById("loudVal");
    var energyVal = document.getElementById("energyVal");
    var speechVal = document.getElementById("speechVal");
    var valenceVal = document.getElementById("valenceVal");
    var danceValMax = document.getElementById("danceValMax");
    var tempoValMax = document.getElementById("tempoValMax");
    var loudValMax = document.getElementById("loudValMax");
    var energyValMax = document.getElementById("energyValMax");
    var speechValMax = document.getElementById("speechValMax");
    var valenceValMax = document.getElementById("valenceValMax");

    danceVal.innterHTML = danceSlider.nodeValue;
    tempoVal.innterHTML = tempoSlider.nodeValue;
    loudVal.innterHTML = loudSlider.nodeValue;
    energyVal.innerHTML = energySlider.nodeValue;
    speechVal.innterHTML = speechSlider.nodeValue;
    valenceVal.innerHTML = valenceSlider.nodeValue;
    danceValMax.innterHTML = danceSliderMax.nodeValue;
    tempoValMax.innterHTML = tempoSliderMax.nodeValue;
    loudValMax.innterHTML = loudSliderMax.nodeValue;
    energyValMax.innerHTML = energySliderMax.nodeValue;
    speechValMax.innterHTML = speechSliderMax.nodeValue;
    valenceValMax.innerHTML = valenceSliderMax.nodeValue;

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
    speechSlider.oninput = function() {
        speechVal.innerHTML = this.value;
    }
    valenceSlider.oninput = function() {
        valenceVal.innerHTML = this.value;
    }
    danceSliderMax.oninput = function() {
        danceValMax.innerHTML = this.value;
    }
    tempoSliderMax.oninput = function() {
        tempoValMax.innerHTML = this.value;
    }
    loudSliderMax.oninput = function() {
        loudValMax.innerHTML = this.value;
    }
    energySliderMax.oninput = function() {
        energyValMax.innerHTML = this.value;
    }
    speechSliderMax.oninput = function() {
        speechValMax.innerHTML = this.value;
    }
    valenceSliderMax.oninput = function() {
        valenceValMax.innerHTML = this.value;
    }

    $(document).ready(function() {
        $("#playlistBtn").click(function(){
            let cardGroup = document.getElementById("cardGroup");
            if(cardGroup){
                cardGroup.remove();
                document.getElementById("moreBtn").remove();
            }
            var filterVals = {
                danceMin: danceSlider.value,
                danceMax: danceSliderMax.value,
                tempoMin: tempoSlider.value,
                tempoMax: tempoSliderMax.value,
                loudMin: loudSlider.value,
                loudMax: loudSliderMax.value,
                energyMin: energySlider.value,
                energyMax: energySliderMax.value,
                speechMin: speechSlider.value,
                speechMax: speechSliderMax.value,
                valenceMin: valenceSlider.value,
                valenceMax: valenceSliderMax.value,
            };
            getSongs(filterVals, 0);
        });
    });

    let offset = 1;

    $(document).on("click", "#moreBtn", function() {
        var filterVals = {
            danceMin: danceSlider.value,
            danceMax: danceSliderMax.value,
            tempoMin: tempoSlider.value,
            tempoMax: tempoSliderMax.value,
            loudMin: loudSlider.value,
            loudMax: loudSliderMax.value,
            energyMin: energySlider.value,
            energyMax: energySliderMax.value,
            speechMin: speechSlider.value,
            speechMax: speechSliderMax.value,
            valenceMin: valenceSlider.value,
            valenceMax: valenceSliderMax.value,
        };
      getSongs(filterVals, offset);
      offset+=1;
      console.log("more click");
    });

    $(document).on("click", "#resetBtn", function(){
        document.getElementById("cardGroup").remove();
        document.getElementById("moreBtn").remove();
        document.getElementById("resetBtn").remove();
    })

  };


  $(function() {
    getToken();
    loadPage();


    //getSongs();
  });

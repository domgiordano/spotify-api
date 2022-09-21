let access_token = "";
let refresh_token = "";
let songJson = {};
let songAttrJson = {};

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
                <p class="subtitle is-5" style="text-align: center"> Dancability <span id="danceVal"> 0 </span> to <span id="danceValMax"> 1.00 </span></p>
                MIN: <input id="danceSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX: <input id="danceSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-5" style="text-align: center"> Loudness <span id="loudVal"> -60 </span> to <span id="loudValMax"> 0.00 </span></p>
                MIN: <input id="loudSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="-60.00" max="0.00" value="-60.00" type="range"><br>
                MAX: <input id="loudSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="-60.00" max="0.00" value="0.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-5" style="text-align: center"> Tempo <span id="tempoVal"> 0 </span> to <span id="tempoValMax"> 200 </span></p>
                MIN: <input id="tempoSlider" class="slider has-output-tooltip is-fullwidth" step="1" min="0" max="200" value="0" type="range"><br>
                MAX: <input id="tempoSliderMax" class="slider has-output-tooltip is-fullwidth" step="1" min="0" max="200" value="200" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-5" style="text-align: center"> Energy <span id="energyVal"> 0 </span> to <span id="energyValMax"> 1.00 </span></p>
                MIN <input id="energySlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX <input id="energySliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-5" style="text-align: center"> Speechiness <span id="speechVal"> 0 </span> to <span id="speechValMax"> 1.00 </span></p>
                MIN: <input id="speechSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX: <input id="speechSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
            <div class="column is-one-quarter">
                <p class="subtitle is-5" style="text-align: center"> Valence <span id="valenceVal"> 0 </span> to <span id="valenceValMax"> 1.00 </span></p>
                MIN: <input id="valenceSlider" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="0" type="range"><br>
                MAX: <input id="valenceSliderMax" class="slider has-output-tooltip is-fullwidth" step=".01" min="0.00" max="1.00" value="1.00" type="range">
            </div>
            <div class="column is-one-quarter">
              <p class="subtitle is-5" style="text-align: center"> Min Date </p>
              <div class="select is-link is-rounded">
                <select id="minMonth">
                  <option>Month</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>
              <div class="select is-link is-rounded">
                <select id="minYear">
                  <option>Year</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                  <option>2019</option>
                  <option>2018</option>
                  <option>2017</option>
                  <option>2016</option>
                  <option>2015</option>
                  <option>2014</option>
                  <option>2013</option>
                  <option>2012</option>
                  <option>2011</option>
                  <option>2010</option>
                </select>
              </div>
            </div>
            <div class="column is-one-quarter">
              <p class="subtitle is-5" style="text-align: center"> Max Date </p>
              <div class="select is-link is-rounded">
                <select id="maxMonth">
                  <option>Month</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>
              <div class="select is-link is-rounded">
                <select id="maxYear">
                  <option>Year</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                  <option>2019</option>
                  <option>2018</option>
                  <option>2017</option>
                  <option>2016</option>
                  <option>2015</option>
                  <option>2014</option>
                  <option>2013</option>
                  <option>2012</option>
                  <option>2011</option>
                  <option>2010</option>
                </select>
              </div>
            </div>
        </div>
        <button id="playlistBtn" class="button is-link is-light is-large is-outlined is-rounded">
          SUBMIT
        </button>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div id="footer" class="hero-foot has-background-black-bis">
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
    console.log(filterVals['minMonth']);
    //Check filter values
    if(filterVals['energyMin'] >= filterVals['energyMax']){
        alert("Invalid Energy Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        return;
    }
    if(filterVals['danceMin'] >= filterVals['danceMax']){
        alert("Invalid Dancability Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        return;
    }
    if(filterVals['tempoMin'] >= filterVals['tempoMax']){
        alert("Invalid Tempo Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        return;
    }
    if(filterVals['loudMin'] >= filterVals['loudMax']){
        alert("Invalid Loudness Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        return;
    }
    if(filterVals['speechMin'] >= filterVals['speechMax']){
        alert("Invalid Speechiness Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        return;
    }
    if(filterVals['valenceMin'] >= filterVals['valenceMax']){
        alert("Invalid Valence Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        return;
    }

    if(filterVals['minYear'] > filterVals ['maxYear']){
      alert("Invalid Date Range, doofus")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      return;
    }

    if(filterVals['minYear'] == filterVals['maxYear'] && filterVals['minMonth'] > filterVals['maxMonth']){
      alert("Invalid Date Range, nerd")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      return;
    }

    if(filterVals['minMonth'] == 'Month' || filterVals['maxMonth'] == 'Month' || filterVals['minYear'] == 'Year' || filterVals['maxYear'] == 'Year'){
      alert("Invalid Date Range, dweeb")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      return;
    }

    const maxSongs = 50;
    let playlistSongCount=0;
    let songInfo = '';
    if(offset == 0) {
        //ongInfo+='<div id="cardGroup" class="columns is-multiline" style="margin-left: 0.025%">';
        songInfo+= '<table id="playlistTable" class="table is-hoverable">';
        songInfo+= '<thead><tr><th><abbr title="Number">Num</abbr></th>';
        songInfo+='<th> Cover Art </th>'
        songInfo+= '<th>Song Title</th>';
        songInfo+='<th>Artist</th>';
        songInfo+='<th><abbr title="Danceability">DNC</abbr></th>';
        songInfo+='<th><abbr title="Energy">ENG</abbr></th>';
        songInfo+='<th><abbr title="Loudness">db</abbr></th>';
        songInfo+='<th><abbr title="Tempo">BPM</abbr></th>';
        songInfo+='<th><abbr title="Speechiness">SPCH</abbr></th>';
        songInfo+='<th><abbr title="Valence">VAL</abbr></th>';
        songInfo+='<th>Date Added</th>';
        songInfo+='</tr></thead>';
        songInfo+='<tbody id="playlistTableBody">'
    }
    let songIds = [];
    let songJson = {};
    do{
      const url = 'https://api.spotify.com/v1/me/tracks?limit='+ maxSongs + '&offset=' + (offset * maxSongs);
      const headers = {
        Authorization: 'Bearer ' + access_token
      }

      const response = await fetch(url, { headers });

      const data = await response.json();

      if(data.items.length === 0){
        console.log("no more songs");
        break;
      }

      for(let i = 1; i < maxSongs + 1; i++){
        if(data.items[i-1] == null){
          console.log("donezo");
          break;
        }
        let month = data.items[i-1].added_at.slice(5,7);
        let year = data.items[i-1].added_at.slice(0,4);

        if( month <= filterVals['maxMonth'] && month >= filterVals['minMonth'] && year <= filterVals['maxYear'] && year >= filterVals['minYear']){
          songJson[data.items[i-1].track.id] = data.items[i-1];
          songIds.push(data.items[i-1].track.id);
        }
      }

      offset++;
    }while(true);

    let songAttrJson = {};
    console.log(Object.keys(songJson).length)
    for(let i = 1; i < songIds.length + 1; i++){

        let songName = songJson[songIds[i-1]].track.name;
        let songArtists = "";
        for(let j = 0; j < songJson[songIds[i-1]].track.artists.length; j++){
          if (j == 0) {
            songArtists += songJson[songIds[i-1]].track.artists[j].name;
          }
          else if (j == 1) {
            songArtists += " ft. " + songJson[songIds[i-1]].track.artists[j].name;
          }
          else {
            songArtists += " & " + songJson[songIds[i-1]].track.artists[j].name;
          }
        }

        let songImage = songJson[songIds[i-1]].track.album.images[0].url;

        const headers = {
          Authorization: 'Bearer ' + access_token
        }

        const songURL = 'https://api.spotify.com/v1/audio-features/' + songIds[i-1];
        const songResponse = await fetch(songURL, { headers });
        const songData = await songResponse.json();


        if (songData.energy > filterVals['energyMin'] && songData.energy < filterVals['energyMax'] &&
                songData.danceability > filterVals['danceMin'] && songData.danceability < filterVals['danceMax'] &&
                songData.tempo > filterVals['tempoMin'] && songData.tempo < filterVals['tempoMax'] &&
                songData.loudness > filterVals['loudMin'] && songData.loudness < filterVals['loudMax'] &&
                songData.speechiness > filterVals['speechMin'] && songData.speechiness < filterVals['speechMax'] &&
                songData.valence > filterVals['valenceMin'] && songData.valence < filterVals['valenceMax']){

            playlistSongCount++;
            let month = songJson[songIds[i-1]].added_at.slice(5,7);
            let year = songJson[songIds[i-1]].added_at.slice(0,4);
            let day = songJson[songIds[i-1]].added_at.slice(8,10);
            songInfo+='<tr><th>' + i + '</th>';
            songInfo+='<td><img src="' + songImage + '"/></td>';
            songInfo+='<td>' + songName + '</td>';
            songInfo+='<td>' + songArtists + '</td>';
            songInfo+='<td>' + songData.danceability + '</td>';
            songInfo+='<td>' + songData.energy + '</td>';
            songInfo+='<td>' + songData.loudness + '</td>';
            songInfo+='<td>' + songData.tempo + '</td>';
            songInfo+='<td>' + songData.speechiness + '</td>';
            songInfo+='<td>' + songData.valence + '</td>';
            songInfo+='<td>' + month + '/' + day + '/' + year + '</td>';
            songInfo+='</tr>';

            songAttrJson[songIds[i-1]] = songData;


        }
        else{
          delete songJson[songIds[i-1]];
        }


    }

    console.log(Object.keys(songJson).length)

    songInfo+='</tbody>';
    console.log(songIds)

    let resetButton = document.getElementById("resetBtn");
    let buttonInfo ='<div><button id="resetBtn" class="button is-warning is-light is-large is-outlined is-rounded"> Reset Page pls. </button></div>';
    let sortInfo ='<form id="sortRB" class="control"><label class="radio"><input type="radio" name="sort" checked>Danceability</label>';
    sortInfo +='<label class="radio"><input type="radio" name="sort">Loudness</label>';
    sortInfo +='<label class="radio"><input type="radio" name="sort">Tempo</label>';
    sortInfo +='<label class="radio"><input type="radio" name="sort">Energy</label>';
    sortInfo +='<label class="radio"><input type="radio" name="sort">Speechiness</label>';
    sortInfo +='<label class="radio"><input type="radio" name="sort">Valence</label>';
    sortInfo +='<label class="radio"><input type="radio" name="sort">Date</label></form>';
    let orderInfo = '<form id="orderRB" class="radio"><label class="radio"><input val="ASC" type="radio" name="order" checked>ASC</label>';
    orderInfo+='<label class="radio"><input val="DESC" type="radio" name="order">DESC</label></form>';
    let sortButtonInfo = '<div><button id="sortBtn" class="button is-danger is-light is-large is-outlined is-rounded"> Sort that shiiii </button></div>';


    songInfo+='</table>';
    $('#main').append(songInfo);
    $('#main').append(buttonInfo);
    $('#main').append(sortInfo);
    $('#main').append(orderInfo);
    $('#main').append(sortButtonInfo);
    document.getElementById("playlistBtn").classList.remove('is-loading')
    return Promise.resolve([songJson, songAttrJson]);
  }

  async function sortPlaylist(songs, songAttrs, sortVal, orderVal) {
    console.log(sortVal);
    console.log(orderVal);
    console.log(songs);
    console.log(songAttrs);
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

    var minMonthVal = document.getElementById("minMonth");
    var minYearVal = document.getElementById("minYear");
    var maxMonthVal = document.getElementById("maxMonth");
    var maxYearVal = document.getElementById("maxYear");

    $(document).ready(function() {
        $("#playlistBtn").click(function(){
            document.getElementById("playlistBtn").classList.add('is-loading')
            let playlistTable = document.getElementById("playlistTable");
            if(playlistTable){
                playlistTable.remove();
                document.getElementById("resetBtn").remove();
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
                minMonth: minMonthVal.value,
                minYear: minYearVal.value,
                maxMonth: maxMonthVal.value,
                maxYear: maxYearVal.value,
            };
            let songResults = getSongs(filterVals, 0);
            let songJson = songResults[0];
            let songAttrJson = songResults[1];
            console.log(songJson);
            console.log(songAttrJson);
        });
    });


    $(document).on("click", "#resetBtn", function(){
        document.getElementById("playlistTable").remove();
        document.getElementById("resetBtn").remove();
        document.getElementById("sortBtn").remove();
        document.getElementById("orderRB").remove();
        document.getElementById("sortRB").remove();

    })

    $(document).on("click", "#sortBtn", function(){
      console.log("sort it")
      let sortVal = $("input[name=sort]:checked", "#sortRB").val();
      let orderVal = $("input[name=order]:checked", "#orderRB").val();
      sortPlaylist(songJson, songAttrJson, sortVal, orderVal);
    });

  };


  $(function() {
    getToken();
    loadPage();


    //getSongs();
  });

let access_token = "";
let refresh_token = "";
let songJson = {};
let songAttrJson = {};
const maxGenres = 25;

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
        <div id="filterValues" class="columns is-multiline">
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
            <div id="genreCheckBoxes" class="column is-full">
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

  async function getSongs(filterVals, offset, allSongs, topGenres, artistGenres) {
    let genreFilter = [];
    console.log(allSongs)
    console.log(topGenres);

    let songs = await allSongs;
    // get checkbox values if genres have been loaded
    let count = 1;
    for(let genres in topGenres){
      if(document.getElementById('genre' + count).checked){
        genreFilter.push(genres.toLowerCase());
      }
      count++;
      if(count == 26){break;}
    }



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
        songInfo+='<th class="has-text-centered"> Cover Art </th>'
        songInfo+= '<th id= "pTableSong" class="has-text-centered">Song Title</th>';
        songInfo+='<th id="pTableArtist" class="has-text-centered">Artist</th>';
        songInfo+='<th id="pTableDance" class="has-text-centered"><abbr title="Danceability">DNC</abbr></th>';
        songInfo+='<th id="pTableEnergy" class="has-text-centered"><abbr title="Energy">ENG</abbr></th>';
        songInfo+='<th id="pTableLoud" class="has-text-centered"><abbr title="Loudness">db</abbr></th>';
        songInfo+='<th id="pTableTempo" class="has-text-centered"><abbr title="Tempo">BPM</abbr></th>';
        songInfo+='<th id="pTableSpeech" class="has-text-centered"><abbr title="Speechiness">SPCH</abbr></th>';
        songInfo+='<th id="pTableValence" class="has-text-centered"><abbr title="Valence">VAL</abbr></th>';
        songInfo+='<th id="pTableDate" class="has-text-centered">Date Added</th>';
        songInfo+='</tr></thead>';
        songInfo+='<tbody id="playlistTableBody">'
    }
    let songIds = [];
    let tempSongJson = {};

    for(let songID in allSongs){
      let month = allSongs[songID].added_at.slice(5,7);
      let year = allSongs[songID].added_at.slice(0,4);
      let validDate = false;
      if( month <= filterVals['maxMonth'] && month >= filterVals['minMonth'] && year <= filterVals['maxYear'] && year >= filterVals['minYear']){
        validDate = true;
      }
      let validGenre = false;
      if(genreFilter.length != 0){
        loopJ:
          for(let j = 0; j < allSongs[songID].track.artists.length; j++){
            let currArtistGenres = artistGenres[allSongs[songID].track.artists[j].id]
            if(currArtistGenres == null){continue;}
            for(let k = 0; k < currArtistGenres.length; k++){
              for(let l = 0; l < genreFilter.length; l++){
                if(genreFilter[l] == currArtistGenres[k]){
                  validGenre = true;
                  break loopJ;
                }
              }
            }
          }
      }
      else{
        validGenre = true;
      }

      if(validDate && validGenre){
        tempSongJson[allSongs[songID].track.id] = allSongs[songID];
        songIds.push(allSongs[songID].track.id);
      }

      offset++;
    }

    let tempSongAttrJson = {};
    console.log(Object.keys(tempSongJson).length)
    for(let i = 1; i < songIds.length + 1; i++){

        let songName = tempSongJson[songIds[i-1]].track.name;
        let songArtists = tempSongJson[songIds[i-1].artist_string];

        let songImage = tempSongJson[songIds[i-1]].track.album.images[0].url;

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
            let month = tempSongJson[songIds[i-1]].added_at.slice(5,7);
            let year = tempSongJson[songIds[i-1]].added_at.slice(0,4);
            let day = tempSongJson[songIds[i-1]].added_at.slice(8,10);
            songInfo+='<tr><th>' + i + '</th>';
            songInfo+='<td><img src="' + songImage + '" height="100" width="100"></td>';
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
            songData.added_at = tempSongJson[songIds[i-1]].added_at;
            songData.name = songName;
            songData.artist = tempSongJson[songIds[i-1]].track.artists[0].name;
            tempSongAttrJson[songIds[i-1]] = songData;


        }
        else{
          delete tempSongJson[songIds[i-1]];
        }


    }

    console.log(Object.keys(tempSongJson).length)

    songInfo+='</tbody>';
    console.log(songIds)

    let resetButton = document.getElementById("resetBtn");
    let buttonInfo ='<div><button id="resetBtn" class="button is-warning is-light is-large is-outlined is-rounded"> Reset Page pls. </button></div>';
    let songNumberInfo='<div id="pTotal"><p class="title is-3">Number of Songs Selected: ' + Object.keys(tempSongJson).length + '</p>';
    songInfo+='</table>';
    $('#main').append(songNumberInfo);
    $('#main').append(songInfo);
    $('#main').append(buttonInfo);
    document.getElementById("playlistBtn").classList.remove('is-loading')

    songJson = tempSongJson;
    songAttrJson = tempSongAttrJson;

    return Promise.resolve([tempSongJson, tempSongAttrJson]);
  }

  async function sortPlaylist(songs, songAttrs, sortVal, isASC) {
    console.log(sortVal);
    console.log(isASC);
    console.log(songs);
    console.log(songAttrs);

    sortVal = sortVal.toLowerCase();
    let tempVals = Object.values(songAttrs);
    let tempKeys = Object.keys(songAttrs);
    let sortValCount = {};

    //makes obj with Key: SongID - Value: SortVal
    for(let i = 0; i < tempVals.length; i++){
      let key = tempKeys[i]
      sortValCount[key] = (tempVals[i])[sortVal];
    }

    let sortable = [];
    for(var id in sortValCount){
        if(sortVal == 'added_at'){
          sortable.push([id, new Date(sortValCount[id])]);
        }
        else{
          sortable.push([id, sortValCount[id]])
        }

    }

    if(isASC){
      if(sortVal == 'name' || sortVal == 'artist'){
        sortable.sort((a,b) => a[1].localeCompare(b[1]));
      }
      else{
        sortable.sort(function(a, b) {
          return a[1] - b[1];
        });
      }
    }
    if(!isASC){
      if(sortVal == 'name' || sortVal == 'artist'){
        sortable.sort((a,b) => b[1].localeCompare(a[1]));
      }
      else{
        sortable.sort(function(a, b) {
          return b[1] - a[1];
        });
      }
    }


    let valueSorted = {};
    sortable.forEach(function(item){
      valueSorted[item[0]]=item[1]
    });
    console.log(valueSorted);

    //Reload data sorted
    $('#resetBtn').trigger('click');
    let playlistSongCount=1;

    //Construct Table Header
    let songInfo = '';
    songInfo+= '<table id="playlistTable" class="table is-hoverable">';
    songInfo+= '<thead><tr><th><abbr title="Number">Num</abbr></th>';
    songInfo+='<th class="has-text-centered"> Cover Art </th>'
    songInfo+= '<th id= "pTableSong" class="has-text-centered">Song Title</th>';
    songInfo+='<th id="pTableArtist" class="has-text-centered">Artist</th>';
    songInfo+='<th id="pTableDance" class="has-text-centered"><abbr title="Danceability">DNC</abbr></th>';
    songInfo+='<th id="pTableEnergy" class="has-text-centered"><abbr title="Energy">ENG</abbr></th>';
    songInfo+='<th id="pTableLoud" class="has-text-centered"><abbr title="Loudness">db</abbr></th>';
    songInfo+='<th id="pTableTempo" class="has-text-centered"><abbr title="Tempo">BPM</abbr></th>';
    songInfo+='<th id="pTableSpeech" class="has-text-centered"><abbr title="Speechiness">SPCH</abbr></th>';
    songInfo+='<th id="pTableValence" class="has-text-centered"><abbr title="Valence">VAL</abbr></th>';
    songInfo+='<th id="pTableDate" class="has-text-centered">Date Added</th>';
    songInfo+='</tr></thead>';
    songInfo+='<tbody id="playlistTableBody">'

    //Construct Table Rows
    for(var id in valueSorted){
      let song = songs[id].track;
      let songAttr = songAttrs[id];
      let songName = song.name;
      let songArtists = "";
      for(let j = 0; j < song.artists.length; j++){
        if (j == 0) {
          songArtists += song.artists[j].name;
        }
        else if (j == 1) {
          songArtists += " ft. " + song.artists[j].name;
        }
        else {
          songArtists += " & " + song.artists[j].name;
        }
      }

      let songImage = song.album.images[0].url;

      let month = songAttr.added_at.slice(5,7);
      let year = songAttr.added_at.slice(0,4);
      let day = songAttr.added_at.slice(8,10);
      songInfo+='<tr><th>' + playlistSongCount + '</th>';
      songInfo+='<td><img src="' + songImage + '" height="100" width="100"></td>';
      songInfo+='<td>' + songName + '</td>';
      songInfo+='<td>' + songArtists + '</td>';
      songInfo+='<td>' + songAttr.danceability + '</td>';
      songInfo+='<td>' + songAttr.energy + '</td>';
      songInfo+='<td>' + songAttr.loudness + '</td>';
      songInfo+='<td>' + songAttr.tempo + '</td>';
      songInfo+='<td>' + songAttr.speechiness + '</td>';
      songInfo+='<td>' + songAttr.valence + '</td>';
      songInfo+='<td>' + month + '/' + day + '/' + year + '</td>';
      songInfo+='</tr>';
      playlistSongCount++;
    }

    songInfo+='</tbody>';

    let resetButton = document.getElementById("resetBtn");
    let buttonInfo ='<div><button id="resetBtn" class="button is-warning is-light is-large is-outlined is-rounded"> Reset Page pls. </button></div>';
    let songNumberInfo='<div id="pTotal"><p class="title is-3">Number of Songs Selected: ' + Object.keys(songs).length + '</p>';
    songInfo+='</table>';
    $('#main').append(songNumberInfo);
    $('#main').append(songInfo);
    $('#main').append(buttonInfo);
    document.getElementById("playlistBtn").classList.remove('is-loading')

    songJson = songs;
    songAttrJson = songAttrs;

    return;

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
            document.getElementById("playlistBtn").classList.add('is-loading');
            let playlistTable = document.getElementById("playlistTable");
            if(playlistTable){
                playlistTable.remove();
                document.getElementById("resetBtn").remove();
                document.getElementById("pTotal").remove();
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

            localforage.getItem('artistGenres').then(function(artistGenres) {
              localforage.getItem('topGenres').then(function(topGenres) {
                localforage.getItem('allSongs').then(function(allSongs) {
                  getSongs(filterVals, 0, allSongs, topGenres, artistGenres);
                });
              });
            });

            //let songResults = getSongs(filterVals, 0);
            //let songJson = songResults[0];
            //let songAttrJson = songResults[1];
            //console.log(songJson);
            //console.log(songAttrJson);
        });
    });

      if(localStorage.getItem('artistGenres') != null){
        //Render Checkboxes for filters
        let checkBoxInfo = '<p class="title is-4">Filter by Genre:</p>';
        checkBoxInfo += '<div class="columns is-multiline has-text-left">';
        checkBoxInfo += '<div class="column is-one-fifth">';
        checkBoxInfo += '<form method="post" action="/Tests/Post/">';
        checkBoxInfo += '<fieldset>';

        for(let i = 1; i < maxGenres + 1; i++){
          checkBoxInfo+='<input type="checkbox" id="genre' + i + '" name="filterGenre" value="'+ localStorage.getItem("genre" + i) +'">';
          checkBoxInfo+='<label for="'+ localStorage.getItem("genre" + i) +'"> '+ localStorage.getItem("genre" + i).toUpperCase() +' </label><br>';
          if(i % 5 == 0){
            checkBoxInfo+='</fieldset>';
            checkBoxInfo+='</form>';
            checkBoxInfo+='</div>';
            if(i != maxGenres){
              checkBoxInfo += '<div class="column is-one-fifth">';
              checkBoxInfo += '<form method="post" action="/Tests/Post/">';
              checkBoxInfo += '<fieldset>';
            }

          }
        }
        checkBoxInfo+='</div>';
        $('#genreCheckBoxes').append(checkBoxInfo);
      }
      else{
        alert("Go to 'Top Genres' to download and use your top genres as filters for playlists.");
      }



    $(document).on("click", "#resetBtn", function(){
        document.getElementById("playlistTable").remove();
        document.getElementById("resetBtn").remove();
        document.getElementById("pTotal").remove();

    })


    let pTableSong= true;
    let pTableArtist= true;
    let pTableDance= true;
    let pTableEnergy= true;
    let pTableLoud= true;
    let pTableTempo= true;
    let pTableSpeech= true;
    let pTableValence= true;
    let pTableDate = true;


    $(document).on("click", "#pTableSong", function(){
      console.log("click table song");
      console.log(pTableSong)
      sortPlaylist(songJson, songAttrJson, "name", pTableSong)
      pTableSong = !pTableSong;
    });
    $(document).on("click", "#pTableArtist", function(){
      console.log("click table artist");
      console.log(pTableArtist)
      sortPlaylist(songJson, songAttrJson, "artist", pTableArtist)
      pTableArtist = !pTableArtist;
    });
    $(document).on("click", "#pTableDance", function(){
      console.log("click table dance");
      console.log(pTableDance)
      sortPlaylist(songJson, songAttrJson, "danceability", pTableDance)
      pTableDance = !pTableDance;
    });
    $(document).on("click", "#pTableEnergy", function(){
      console.log("click table energy");
      console.log(pTableEnergy)
      sortPlaylist(songJson, songAttrJson, "energy", pTableEnergy)
      pTableEnergy = !pTableEnergy;
    });
    $(document).on("click", "#pTableLoud", function(){
      console.log("click table loud");
      console.log(pTableLoud)
      sortPlaylist(songJson, songAttrJson, "loudness", pTableLoud)
      pTableLoud = !pTableLoud;
    });
    $(document).on("click", "#pTableTempo", function(){
      console.log("click table tempo");
      console.log(pTableTempo)
      sortPlaylist(songJson, songAttrJson, "tempo", pTableTempo)
      pTableTempo = !pTableTempo;
    });
    $(document).on("click", "#pTableSpeech", function(){
      console.log("click table speech");
      console.log(pTableSpeech)
      sortPlaylist(songJson, songAttrJson, "speechiness", pTableSpeech)
      pTableSpeech = !pTableSpeech;
    });
    $(document).on("click", "#pTableValence", function(){
      console.log("click table valence");
      console.log(pTableValence)
      sortPlaylist(songJson, songAttrJson, "valence", pTableValence)
      pTableValence = !pTableValence;
    });
    $(document).on("click", "#pTableDate", function(){
      console.log("click table date");
      console.log(pTableDate)
      sortPlaylist(songJson, songAttrJson, "added_at", pTableDate)
      pTableDate = !pTableDate;
    });

  };


  $(function() {
    getToken();
    loadPage();

    //getSongs();
  });

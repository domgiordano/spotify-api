//const $ = require('jquery');
let access_token = "";
let refresh_token = "";
let songJson = {};
let songAttrJson = {};
let totalSongCount = 0;
const maxGenres = 30;
let songsRemoved = 0;

const renderPage = function() {
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
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/wrapped?access_token=${access_token}&refresh_token=${refresh_token}'">
              Wrapped
            </a>
          </div>
          </div>
        </div>
      </header>
    </div>

    <div class="hero-body">

      <div id="main" class="container has-text-centered" >
        <p class="title is-1">Select Filters</p>
        <div id="filterValues" class="columns is-multiline" style="margin: 0; padding: 0">
          <div id="card_1" class="column is-one-quarter" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="DANCEABILITY">DNC</span></p>
              MIN: <input id="danceMin" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="0.00" type="number">
              MAX: <input id="danceMax" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="1.00" type="number">
            </div>
          </div>
          <div id="card_2" class="column" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="LOUDNESS">dB</span></p>
              MIN: <input id="loudMin" class="input is-rounded is-normal is-link" step="1" min="-60" max="60" value="-60" type="number">
              MAX: <input id="loudMax" class="input is-rounded is-normal is-link" step="1" min="-60" max="60" value="60" type="number">
            </div>
          </div>
          <div id="card_3" class="column is-one-quarter" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="TEMPO">BPM</span></p>
              MIN: <input id="tempoMin" class="input is-rounded is-normal is-link" step="1" min="0" max="250" value="0" type="number">
              MAX: <input id="tempoMax" class="input is-rounded is-normal is-link" step="1" min="0" max="250" value="250" type="number">
            </div>
          </div>
          <div id="card_4" class="column is-one-quarter" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="ENERGY">ENRG</span></p>
              MIN: <input id="energyMin" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="0.00" type="number">
              MAX: <input id="energyMax" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="1.00" type="number">
            </div>
          </div>
          <div id="card_5" class="column is-one-quarter" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="INSTRUMENTALNESS">INSTRU</span></p>
              MIN: <input id="instruMin" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="0.00" type="number">
              MAX: <input id="instruMax" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="1.00" type="number">
            </div>
          </div>
          <div id="card_6" class="column is-one-quarter" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="VALENCE">VAL</span></p>
              MIN: <input id="valenceMin" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="0.00" type="number">
              MAX: <input id="valenceMax" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="1.00" type="number">
            </div>
          </div>
          <div id="card_7" class="column is-one-quarter" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="ACOUSTICNESS">ACST</span></p>
              MIN: <input id="acoustMin" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="0.00" type="number">
              MAX: <input id="acoustMax" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="1.00" type="number">
            </div>
          </div>
          <div id="card_8" class="column is-one-quarter" style="width: 12.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="POPULARITY">POP</span></p>
              MIN: <input id="popMin" class="input is-rounded is-normal is-link" step="1" min="0" max="100" value="0" type="number">
              MAX: <input id="popMax" class="input is-rounded is-normal is-link" step="1" min="0" max="100" value="100" type="number">
            </div>
          </div>
          <div id="card_9" class="column is-one-quarter" style="width: 16.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="SPEECHINESS">SPCH</span></p>
              MIN: <input id="speechMin" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="0.00" type="number">
              MAX: <input id="speechMax" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="1.00" type="number">
            </div>
          </div>
          <div class="column is-4">
            <p class="subtitle is-4" style="text-align: center">Saved to Library Date:</p>
            <div id="songSaved" class="columns is-multiline" style="margin: 0; padding: 0">
              <div class="column is-half">
                MIN Month: <input id="minMonthSaved" class="input is-rounded is-normal is-link" min="1" max="12" value="1" type="number">
                MIN Year: <input id="minYearSaved" class="input is-rounded is-normal is-link" min="1900" max="${getYear()}" value="1900" type="number">
              </div>
              <div class="column is-half">
                MAX Month: <input id="maxMonthSaved" class="input is-rounded is-normal is-link" min="1" max="12" value="${getMonth()}" type="number">
                MAX Year: <input id="maxYearSaved" class="input is-rounded is-normal is-link" min="1900" max="${getYear()}" value="${getYear()}" type="number">
              </div>
            </div>
          </div>
          <div class="column is-4">
            <p class="subtitle is-4" style="text-align: center">Song Creation Date:</p>
            <div id="songCreate" class="columns is-multiline" style="margin: 0; padding: 0">
              <div class="column is-half">
                MIN Month: <input id="minMonthCreated" class="input is-rounded is-normal is-link" min="1" max="12" value="1" type="number">
                MIN Year: <input id="minYearCreated" class="input is-rounded is-normal is-link" min="1900" max="${getYear()}" value="1900" type="number">
              </div>
              <div class="column is-half">
                MAX Month: <input id="maxMonthCreated" class="input is-rounded is-normal is-link" min="1" max="12" value="${getMonth()}" type="number">
                MAX Year: <input id="maxYearCreated" class="input is-rounded is-normal is-link" min="1900" max="${getYear()}" value="${getYear()}" type="number">
              </div>
            </div>
          </div>
          <div id="card_10" class="column is-one-quarter" style="width: 16.5%">
            <div class="card-content" style="text-align: center">
              <p class="subtitle is-5" style="text-align: center"><span class="hovertext" data-hover="LIVENESS">LIV</span></p>
              MIN: <input id="liveMin" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="0.00" type="number">
              MAX: <input id="liveMax" class="input is-rounded is-normal is-link" step=".01" min="0.00" max="1.00" value="1.00" type="number">
            </div>
          </div>
          <div class="column is-full">
            <p class="subtitle is-4" style="text-align: center">Pre-Set Mood Filters:</p>
          </div>
          <div class="column is-full">
            <button id="hypeBtn" class="button is-link is-light is-medium is-outlined is-rounded"> Hype </button>
            <button id="chillBtn" class="button is-link is-light is-medium is-outlined is-rounded"> Chill </button>
            <button id="happyBtn" class="button is-link is-light is-medium is-outlined is-rounded"> Happy </button>
            <button id="sadBtn" class="button is-link is-light is-medium is-outlined is-rounded"> Sad </button>
          </div>

        </div>

            <div id="genreCheckBoxes" class="column is-full">
            </div>
            <button id="resetBtn" class="button is-warning is-light is-large is-outlined is-rounded" disabled=true > Reset Page pls. </button>
            <button id="playlistBtn" class="button is-link is-light is-large is-outlined is-rounded"> SUBMIT </button>
            <button id="downloadBtn" class="button is-danger is-light is-large is-outlined is-rounded" disabled=true >Download Playlist</button>
            <br>


        </div>


      </div>

    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div id="footer" class="hero-foot has-background-black-bis">
      <nav class="pagination is-centered is-rounded is-large" role="navigation" aria-label="pagination">
        <a id="prevPage" class="pagination-previous is-disabled" title="This is the first page">Previous Page</a>
        <a id="nextPage" class="pagination-next is-disabled">Next page</a>
        <ul class="pagination-list">
          <li>
            <a id="page1" class="pagination-link is-disabled" aria-label="1">1</a>
          </li>
          <li>
            <a id="page2" class="pagination-link is-disabled" aria-label="2">2</a>
          </li>
          <li>
            <a id="page3" class="pagination-link is-disabled" aria-label="3">3</a>
          </li>
          <li>
            <a id="page4" class="pagination-link is-disabled" aria-label="4">4</a>
          </li>
          <li>
            <a id="page5" class="pagination-link is-disabled" aria-label="5">5</a>
          </li>
        </ul>
      </nav>
    </div>
  </section>`
  };

  function getMonth(){
    var today = new Date();
    var mm = String(today.getMonth() + 1);
    return mm;
  }

  function getYear(){
    let today = new Date();
    let yyyy = String(today.getFullYear());
    return yyyy;
  }
  const getToken = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    access_token = urlParams.get('access_token');
    refresh_token = urlParams.get('refresh_token');
    console.log(access_token + " : " + refresh_token)
    return;
  }

  async function getSongs(filterVals, offset, allSongs, topGenres, artistGenres) {
    console.log(Object.keys(allSongs).length)
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

    console.log(genreFilter.length)

    //Check filter values
    if(filterVals['energyMin'] >= filterVals['energyMax']){
        alert("Invalid Energy Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        document.getElementById("resetBtn").disabled = false;
        $('#resetBtn').trigger('click');
        return;
    }
    if(filterVals['danceMin'] >= filterVals['danceMax']){
        alert("Invalid Dancability Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        document.getElementById("resetBtn").disabled = false;
        $('#resetBtn').trigger('click');
        return;
    }
    if(filterVals['tempoMin'] >= filterVals['tempoMax']){
        alert("Invalid Tempo Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        document.getElementById("resetBtn").disabled = false;
        $('#resetBtn').trigger('click');
        return;
    }
    if(filterVals['loudMin'] >= filterVals['loudMax']){
        alert("Invalid Loudness Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        document.getElementById("resetBtn").disabled = false;
        $('#resetBtn').trigger('click');
        return;
    }
    if(filterVals['instruMin'] >= filterVals['instruMax']){
        alert("Invalid Instrumentalness Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        document.getElementById("resetBtn").disabled = false;
        $('#resetBtn').trigger('click');
        return;
    }
    if(filterVals['valenceMin'] >= filterVals['valenceMax']){
        alert("Invalid Valence Values. Try again.")
        document.getElementById("playlistBtn").classList.remove('is-loading')
        document.getElementById("resetBtn").disabled = false;
        $('#resetBtn').trigger('click');
        return;
    }

    if(filterVals['acoustMin'] >= filterVals['acoustMax']){
      alert("Invalid Acousticness Values. Try again.")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      document.getElementById("resetBtn").disabled = false;
      $('#resetBtn').trigger('click');
      return;
    }

    if(filterVals['popMin'] >= filterVals['popMax']){
      alert("Invalid Popularity Values. Try again.")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      document.getElementById("resetBtn").disabled = false;
      $('#resetBtn').trigger('click');
      return;
    }

    if(filterVals['speechMin'] >= filterVals['speechMax']){
      alert("Invalid Speechiness Values. Try again.")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      document.getElementById("resetBtn").disabled = false;
      $('#resetBtn').trigger('click');
      return;
    }

    if(filterVals['liveMin'] >= filterVals['liveMax']){
      alert("Invalid Liveness Values. Try again.")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      document.getElementById("resetBtn").disabled = false;
      $('#resetBtn').trigger('click');
      return;
    }

    if(filterVals['minYearSaved'] > filterVals ['maxYearSaved']){
      alert("Invalid Date Range, doofus")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      document.getElementById("resetBtn").disabled = false;
      $('#resetBtn' + currPage).trigger('click');
      return;
    }

    if(filterVals['minYearSaved'] == filterVals['maxYearSaved'] && filterVals['minMonthSaved'] > filterVals['maxMonthSaved']){
      alert("Invalid Date Range, nerd")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      document.getElementById("resetBtn").disabled = false;
      $('#resetBtn' + currPage).trigger('click');
      return;
    }

    if(filterVals['minYearCreated'] == filterVals['maxYearCreated'] && filterVals['minMonthCreated'] > filterVals['maxMonthCreated']){
      alert("Invalid Date Range, dweeb")
      document.getElementById("playlistBtn").classList.remove('is-loading')
      document.getElementById("resetBtn").disabled = false;
      $('#resetBtn' + currPage).trigger('click');
      return;
    }

    const maxSongs = 50;
    let playlistSongCount=0;
    let songInfo = '';
    if(offset == 0) {
        //ongInfo+='<div id="cardGroup" class="columns is-multiline" style="margin-left: 0.025%">';
        songInfo+= constructTableHeader();
    }
    let songIds = [];
    let tempSongJson = {};

    for(let songID in allSongs){
      let month = allSongs[songID].added_at.slice(5,7);
      let year = allSongs[songID].added_at.slice(0,4);

      let releaseMonth = allSongs[songID].track.album.release_date.slice(5,7);
      let releaseYear = allSongs[songID].track.album.release_date.slice(0,4);


      let validDate = false;
      if( month <= filterVals['maxMonthSaved'] && month >= filterVals['minMonthSaved'] && year <= filterVals['maxYearSaved'] && year >= filterVals['minYearSaved']){
        if(releaseYear <= filterVals['maxYearCreated'] && releaseYear >= filterVals['minYearCreated']){
          if(releaseMonth != ""){
            if(releaseMonth <= filterVals['maxMonthCreated'] && releaseMonth >= filterVals['minMonthCreated']){
              validDate = true;
            }
          }
          else{
            validDate = true;
          }

        }
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

    let trackCount = 1;
    loopAllSongs:
    for(let i = 1; i < songIds.length + 1; i++){
        console.log("Track Count: " + trackCount);
        let songName = tempSongJson[songIds[i-1]].track.name;
        let songArtists = tempSongJson[songIds[i-1]].artist_string;

        let songImage = tempSongJson[songIds[i-1]].track.album.images[0].url;

        const headers = {
          Authorization: 'Bearer ' + access_token
        }

        const songURL = 'https://api.spotify.com/v1/audio-features/' + songIds[i-1];
        const songResponse = await fetch(songURL, { headers });
        const songData = await songResponse.json();

        /* if(songData.energy < filterVals['energyMin'] || songData.energy > filterVals['energyMax']){console.log('energy failed');}
        if(songData.danceability < filterVals['danceMin'] || songData.danceability > filterVals['danceMax']){console.log('dance failed');}
        if(songData.danceability < filterVals['tempoMin'] || songData.danceability > filterVals['tempoMax']){console.log('tempo failed');}
        if(songData.danceability < filterVals['loudMin'] || songData.danceability > filterVals['loudMax']){console.log('loud failed');}
        if(songData.danceability < filterVals['instruMin'] || songData.danceability > filterVals['instruMax']){console.log('instru failed');}
        if(songData.danceability < filterVals['valenceMin'] || songData.danceability > filterVals['valenceMax']){console.log('valence failed');}
        if(songData.danceability < filterVals['acoustMin'] || songData.danceability > filterVals['acoustMax']){console.log('acoust failed');}
        if(songData.danceability < filterVals['popMin'] || songData.danceability > filterVals['popMax']){console.log('pop failed');} */

        if (songData.energy >= filterVals['energyMin'] && songData.energy <= filterVals['energyMax'] &&
                songData.danceability >= filterVals['danceMin'] && songData.danceability <= filterVals['danceMax'] &&
                songData.tempo >= filterVals['tempoMin'] && songData.tempo <= filterVals['tempoMax'] &&
                songData.loudness >= filterVals['loudMin'] && songData.loudness <= filterVals['loudMax'] &&
                songData.instrumentalness >= filterVals['instruMin'] && songData.instrumentalness <= filterVals['instruMax'] &&
                songData.valence >= filterVals['valenceMin'] && songData.valence <= filterVals['valenceMax'] &&
                songData.acousticness >= filterVals['acoustMin'] && songData.acousticness <= filterVals['acoustMax'] &&
                songData.speechiness >= filterVals['speechMin'] && songData.speechiness <= filterVals['speechMax'] &&
                songData.liveness >= filterVals['liveMin'] && songData.liveness <= filterVals['liveMax'] &&
                tempSongJson[songIds[i-1]].track.popularity >= filterVals['popMin'] && tempSongJson[songIds[i-1]].track.popularity <= filterVals['popMax']){

            playlistSongCount++;
            let monthSaved = tempSongJson[songIds[i-1]].added_at.slice(5,7);
            let yearSaved = tempSongJson[songIds[i-1]].added_at.slice(0,4);
            let daySaved = tempSongJson[songIds[i-1]].added_at.slice(8,10);
            let dateCreated = tempSongJson[songIds[i-1]].track.album.release_date.slice(5,7);

            if(tempSongJson[songIds[i-1]].track.album.release_date_precision == 'day') {
              dateCreated += '/' + tempSongJson[songIds[i-1]].track.album.release_date.slice(8,10);
            }

            let dateSaved = monthSaved + '/' + daySaved + '/' + yearSaved;
            dateCreated += '/' + tempSongJson[songIds[i-1]].track.album.release_date.slice(0,4);

            if(trackCount <= maxSongs){
              songInfo+= constructTableRow(trackCount, songImage, songName, songArtists, songData, tempSongJson[songIds[i-1]].track, dateSaved, dateCreated, songIds[i-1]);
            }

            //update songData
            songData.added_at = tempSongJson[songIds[i-1]].added_at;
            songData.release_date = tempSongJson[songIds[i-1]].track.album.release_date;
            songData.popularity = tempSongJson[songIds[i-1]].track.popularity;
            songData.name = songName;
            songData.artist = tempSongJson[songIds[i-1]].track.artists[0].name;
            tempSongAttrJson[songIds[i-1]] = songData;

            trackCount++;

            if(trackCount >= 251){
              for(let x = i; x < songIds.length; x++){
                delete tempSongJson[songIds[x]];
              }
              alert("250+ songs selected. Maybe narrow it down a bit, eh.")
              break loopAllSongs;
            }

        }
        else{
          delete tempSongJson[songIds[i-1]];
        }


    }

    console.log(Object.keys(tempSongJson).length)

    songInfo+='</tbody>';
    console.log(songIds)

    songInfo+='</table>';
    let resetButton = document.getElementById("resetBtn");
    let songNumberInfo ='<div id="pName" class="field"><label style="margin:1em" id="playlistLabel" class="label">Playlist Title:</label><div class="control"><input id="pNameInput" class="input" type="text" placeholder="myPlaylistByDom"></div></div>';
    songNumberInfo +='<div id="pTotal"><br><p class="title is-3">Number of Songs Selected: ' + Object.keys(tempSongJson).length + '</p><br>';

    $('#main').append(songNumberInfo);
    $('#main').append(songInfo);



    //reset buttons
    document.getElementById("playlistBtn").classList.remove('is-loading')
    document.getElementById("downloadBtn").disabled = false;
    document.getElementById("resetBtn").disabled = false;

     //enable all filter value fields
     toggleFilterActive(false);

     //enable check box filters
     for(let i = 1; i < maxGenres + 1; i++){
       document.getElementById("genre" + i).disabled = false;
     }

    //enable Pages
    document.getElementById("nextPage").classList.remove('is-disabled');
    document.getElementById("page1").classList.remove('is-disabled');
    document.getElementById("page1").classList.add('is-current');

    songJson = tempSongJson;
    songAttrJson = tempSongAttrJson;
    totalSongCount = trackCount;

    //set up remove song button listeners
    for(let id in songJson){
      $(document).on('click', '#removeBtn'+ id, function(){
        delete songJson[id];
        delete songAttrJson[id];
        document.getElementById('removeBtn' + id).removeEventListener('click', this);
        sortPlaylist(songJson, songAttrJson, 'none', 'ASC')
      });
    }



    if(Object.keys(songJson).length > 50){document.getElementById("page2").classList.remove('is-disabled');}
    if(Object.keys(songJson).length > 100){document.getElementById("page3").classList.remove('is-disabled');}
    if(Object.keys(songJson).length > 150){document.getElementById("page4").classList.remove('is-disabled');}
    if(Object.keys(songJson).length > 200){document.getElementById("page5").classList.remove('is-disabled');}



    return Promise.resolve([tempSongJson, tempSongAttrJson]);
  }

  async function sortPlaylist(songs, songAttrs, sortVal, isASC) {
    let maxSongs = 50;
    let offset = parseInt(document.getElementsByClassName('is-current')[0].getAttribute('aria-label')) - 1;
    sortVal = sortVal.toLowerCase();
    let tempVals = Object.values(songAttrs);
    let tempKeys = Object.keys(songAttrs);
    let sortValCount = {};
    let valueSorted = {};

    if(sortVal != 'none'){
      //makes obj with Key: SongID - Value: SortVal
      for(let i = 0; i < tempVals.length; i++){
        let key = tempKeys[i]
        sortValCount[key] = (tempVals[i])[sortVal];
      }

      let sortable = [];
      for(var id in sortValCount){
          if(sortVal == 'added_at' || sortVal == 'release_date'){
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



      sortable.forEach(function(item){
        valueSorted[item[0]]=item[1]
      });
    }
    else{
      valueSorted = songs;
    }
    //Reload data sorted
    $('#resetBtn').trigger('click');
    document.getElementById("downloadBtn").disabled = false;
    document.getElementById("resetBtn").disabled = false;
    let playlistSongCount=1;

    //Construct Table Header
    let songInfo = '';
    songInfo+= constructTableHeader();

    //Construct Table Rows
    let sortedPlaylist = {};
    let sortedPlaylistAttr = {};
    for(var id in valueSorted){
      if(playlistSongCount <= maxSongs){
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
        let dateCreated = song.album.release_date.slice(5,7);

        if(song.album.release_date_precision == 'day') {
          dateCreated += '/' + song.album.release_date.slice(8,10);
        }

        let dateSaved = month + '/' + day + '/' + year;
        dateCreated += '/' + song.album.release_date.slice(0,4);

        songInfo += constructTableRow(playlistSongCount, songImage, songName, songArtists, songAttr, song, dateSaved, dateCreated, id);
        //if(playlistSongCount >= maxSongs){break;};
      }
      sortedPlaylist[id] = songJson[id];
      sortedPlaylistAttr[id] = songAttrJson[id];
      playlistSongCount++;
    }

    songInfo+='</tbody>';

    let resetButton = document.getElementById("resetBtn");

    let songNumberInfo ='<div id="pName" class="field"><label style="margin:1em" id="playlistLabel" class="label">Playlist Title:</label><div class="control"><input id="pNameInput" class="input" type="text" placeholder="myPlaylistByDom"></div></div>';
    songNumberInfo +='<div id="pTotal"><br><p class="title is-3">Number of Songs Selected: ' + Object.keys(sortedPlaylist).length + '</p><br>';

    songInfo+='</table>';
    $('#main').append(songNumberInfo);
    $('#main').append(songInfo);
    document.getElementById("playlistBtn").classList.remove('is-loading')

    songJson = sortedPlaylist;
    songAttrJson = sortedPlaylistAttr;
    totalSongCount = playlistSongCount;

    //set up remove song button listeners
    for(let id in songJson){
      $(document).on('click', '#removeBtn'+ id, function(){
        delete songJson[id];
        delete songAttrJson[id];
        document.getElementById('removeBtn' + id).removeEventListener('click', this);
        sortPlaylist(songJson, songAttrJson, 'none', 'ASC')
      });
    }

    return;

  }

  async function downloadPlaylist(songs) {
    getToken();
    //get user
    let userID = localStorage.getItem('userID');
    let playlistName = document.getElementById('pNameInput').value
    if(playlistName == ""){
      playlistName = "Playlist-gen-by-dom"
    }
    console.log(userID)

    const settings = {
      method: 'POST',
      body: JSON.stringify({name: playlistName, description: "Prolly the best playlist you got - made by dom - https://github.com/domjgiordano/spotify-api", public: true}),
      headers: {
        Authorization: 'Bearer ' + access_token
      }
    };

    const url = `https://api.spotify.com/v1/users/${userID}/playlists` ;
    const response = await fetch(url, settings);
    const data = await response.json();

    console.log(data)
    let playlistID = data.id;

    //get song ids into string
    let songIds = '';
    let songCount = 0;
    console.log(songs);

    for(let trackID in songs){
      songIds+= 'spotify:track:' + trackID;
      if(songCount < Object.keys(songs).length - 1){
        songIds+=',';
      }
      songCount++;
    }

    //add songs to playlist
    const trackSettings = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + access_token
      }
    };

    const trackUrl = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=` + songIds ;
    const trackResponse = await fetch(trackUrl, trackSettings);
    const trackData = await trackResponse.json();

    console.log(trackData)

    alert("Playlist '" + playlistName + "' created and downloaded. Check spotify ya filthy animal")

  }

  async function pageController(offset, songs, songAttrs){
    //Reload data sorted
    $('#resetBtn').trigger('click');
    document.getElementById("downloadBtn").disabled = false;
    document.getElementById("resetBtn").disabled = false;
    let playlistSongCount=1;
    let maxSongs = 50;

    //Construct Table Header
    let songInfo = '';
    songInfo+= constructTableHeader();

    //Construct Table Rows
    for(var id in songs){
      if(playlistSongCount > maxSongs * offset){
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
        let dateCreated = song.album.release_date.slice(5,7);

        if(song.album.release_date_precision == 'day') {
          dateCreated += '/' + song.album.release_date.slice(8,10);
        }

        let dateSaved = month + '/' + day + '/' + year;
        dateCreated += '/' + song.album.release_date.slice(0,4);

        songInfo+= constructTableRow(playlistSongCount, songImage, songName, songArtists, songAttr, song, dateSaved, dateCreated, id);

        if(playlistSongCount >= maxSongs *(offset + 1)){break;};
      }
      playlistSongCount++;
    }

    songInfo+='</tbody>';

    let resetButton = document.getElementById("resetBtn");

    let songNumberInfo ='<div id="pName" class="field"><label style="margin:1em" id="playlistLabel" class="label">Playlist Title:</label><div class="control"><input id="pNameInput" class="input" type="text" placeholder="myPlaylistByDom"></div></div>';
    songNumberInfo +='<div id="pTotal"><br><p class="title is-3">Number of Songs Selected: ' + Object.keys(songs).length + '</p><br>';

    songInfo+='</table>';
    $('#main').append(songNumberInfo);
    $('#main').append(songInfo);
    document.getElementById("playlistBtn").classList.remove('is-loading')

    return;
  }

  function toggleFilterActive(status){
    document.getElementById("danceMin").disabled = status;
    document.getElementById("danceMax").disabled = status;
    document.getElementById("tempoMin").disabled = status;
    document.getElementById("tempoMax").disabled = status;
    document.getElementById("loudMin").disabled = status;
    document.getElementById("loudMax").disabled = status;
    document.getElementById("energyMin").disabled = status;
    document.getElementById("energyMax").disabled = status;
    document.getElementById("instruMin").disabled = status;
    document.getElementById("instruMax").disabled = status;
    document.getElementById("valenceMin").disabled = status;
    document.getElementById("valenceMax").disabled = status;
    document.getElementById("popMin").disabled = status;
    document.getElementById("popMax").disabled = status;
    document.getElementById("acoustMin").disabled = status;
    document.getElementById("acoustMax").disabled = status;
    document.getElementById("speechMin").disabled = status;
    document.getElementById("speechMax").disabled = status;
    document.getElementById("liveMin").disabled = status;
    document.getElementById("liveMax").disabled = status;
    document.getElementById("minMonthSaved").disabled = status;
    document.getElementById("minYearSaved").disabled = status;
    document.getElementById("maxMonthSaved").disabled = status;
    document.getElementById("maxYearSaved").disabled = status;
    document.getElementById("minMonthCreated").disabled = status;
    document.getElementById("minYearCreated").disabled = status;
    document.getElementById("maxMonthCreated").disabled = status;
    document.getElementById("maxYearCreated").disabled = status;
  }

  function constructTableHeader(){
    let songInfo = '';
    songInfo+= '<table id="playlistTable" class="table is-hoverable">';
    songInfo+= '<thead><tr><th><abbr title="Number">Num</abbr></th>';
    songInfo+='<th class="has-text-centered"> Cover Art </th>'
    songInfo+= '<th id= "pTableSong" class="has-text-centered">Song Title</th>';
    songInfo+='<th id="pTableArtist" class="has-text-centered">Artist</th>';
    songInfo+='<th id="pTableDance" class="has-text-centered"><abbr title="Danceability">DNC</abbr></th>';
    songInfo+='<th id="pTableTempo" class="has-text-centered"><abbr title="Tempo">BPM</abbr></th>';
    songInfo+='<th id="pTableInstru" class="has-text-centered"><abbr title="Instrumentalness">INSTRU</abbr></th>';
    songInfo+='<th id="pTableAcoust" class="has-text-centered"><abbr title="Acousticness">ACOUST</abbr></th>';
    songInfo+='<th id="pTableLoud" class="has-text-centered"><abbr title="Loudness">db</abbr></th>';
    songInfo+='<th id="pTableEnergy" class="has-text-centered"><abbr title="Energy">ENG</abbr></th>';
    songInfo+='<th id="pTableValence" class="has-text-centered"><abbr title="Valence">VAL</abbr></th>';
    songInfo+='<th id="pTablePop" class="has-text-centered"><abbr title="Popularity">POP</abbr></th>';
    songInfo+='<th id="pTableSpeech" class="has-text-centered"><abbr title="Speechiness">SPCH</abbr></th>';
    songInfo+='<th id="pTableLive" class="has-text-centered"><abbr title="Liveness">LIV</abbr></th>';
    songInfo+='<th id="pTableDate" class="has-text-centered">Date Added</th>';
    songInfo+='<th id="pTableReleaseDate" class="has-text-centered">Date Released</th>';
    songInfo+='<th id="pTableRemove" class="has-text-centered">Remove Song</th>';
    songInfo+='</tr></thead>';
    songInfo+='<tbody id="playlistTableBody">'
    return songInfo;
  }

  function constructTableRow(count, songImage, songName, songArtists, songAttr, song, dateSaved, dateCreated, id){
    let songInfo = '';
    songInfo+='<span id="song' + count + '">';
    songInfo+='<tr><th>' + count + '</th>';
    songInfo+='<td><img src="' + songImage + '" height="100" width="100"></td>';
    songInfo+='<td>' + songName + '</td>';
    songInfo+='<td>' + songArtists + '</td>';
    songInfo+='<td>' + songAttr.danceability + '</td>';
    songInfo+='<td>' + songAttr.tempo + '</td>';
    songInfo+='<td>' + songAttr.instrumentalness + '</td>';
    songInfo+='<td>' + songAttr.acousticness + '</td>';
    songInfo+='<td>' + songAttr.loudness + '</td>';
    songInfo+='<td>' + songAttr.energy + '</td>';
    songInfo+='<td>' + songAttr.valence + '</td>';
    songInfo+='<td>' + song.popularity + '</td>';
    songInfo+='<td>' + songAttr.speechiness + '</td>';
    songInfo+='<td>' + songAttr.liveness + '</td>';
    songInfo+='<td>' + dateSaved + '</td>';
    songInfo+='<td>' + dateCreated + '</td>';
    songInfo+='<td><button id="removeBtn'+ id + '" class="button is-danger is-light is-small is-outlined is-rounded" >Toss dis shit</button></td>';
    songInfo+='</tr></span>';
    return songInfo;
  }

  function resetFilterValues(){
    document.getElementById("danceMin").value = '0.00';
    document.getElementById("danceMax").value = '1.00';
    document.getElementById("tempoMin").value = '0';
    document.getElementById("tempoMax").value = '250';
    document.getElementById("loudMin").value = '-60';
    document.getElementById("loudMax").value = '60';
    document.getElementById("energyMin").value = '0.00';
    document.getElementById("energyMax").value = '1.00';
    document.getElementById("instruMin").value = '0.00';
    document.getElementById("instruMax").value = '1.00';
    document.getElementById("valenceMin").value = '0.00';
    document.getElementById("valenceMax").value = '1.00';
    document.getElementById("popMin").value = '0';
    document.getElementById("popMax").value = '100';
    document.getElementById("acoustMin").value = '0.00';
    document.getElementById("acoustMax").value = '1.00';
    document.getElementById("speechMin").value = '0.00';
    document.getElementById("speechMax").value = '1.00';
    document.getElementById("liveMin").value = '0.00';
    document.getElementById("liveMax").value = '1.00';
  }

  const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());

    $(document).ready(function() {
        $("#playlistBtn").click(function(){
            document.getElementById("playlistBtn").classList.add('is-loading');
            toggleFilterActive(true);

            //disable check box filters
            for(let i = 1; i < maxGenres + 1; i++){
              document.getElementById("genre" + i).disabled = true;
            }
            let playlistTable = document.getElementById("playlistTable");
            if(playlistTable){
                playlistTable.remove();
                document.getElementById("pTotal").remove();
                document.getElementById("pName").remove();

            }
            var filterVals = {
                danceMin: parseFloat(document.getElementById('danceMin').value),
                danceMax: parseFloat(document.getElementById('danceMax').value),
                tempoMin: parseFloat(document.getElementById('tempoMin').value),
                tempoMax: parseFloat(document.getElementById('tempoMax').value),
                loudMin: parseFloat(document.getElementById('loudMin').value),
                loudMax: parseFloat(document.getElementById('loudMax').value),
                energyMin: parseFloat(document.getElementById('energyMin').value),
                energyMax: parseFloat(document.getElementById('energyMax').value),
                instruMin: parseFloat(document.getElementById('instruMin').value),
                instruMax: parseFloat(document.getElementById('instruMax').value),
                valenceMin: parseFloat(document.getElementById('valenceMin').value),
                valenceMax: parseFloat(document.getElementById('valenceMax').value),
                popMin: parseFloat(document.getElementById('popMin').value),
                popMax: parseFloat(document.getElementById('popMax').value),
                acoustMin: parseFloat(document.getElementById('acoustMin').value),
                acoustMax: parseFloat(document.getElementById('acoustMax').value),
                speechMin: parseFloat(document.getElementById('speechMin').value),
                speechMax: parseFloat(document.getElementById('speechMax').value),
                liveMin: parseFloat(document.getElementById('liveMin').value),
                liveMax: parseFloat(document.getElementById('liveMax').value),
                minMonthSaved: parseInt(document.getElementById('minMonthSaved').value),
                minYearSaved: parseInt(document.getElementById('minYearSaved').value),
                maxMonthSaved: parseInt(document.getElementById('maxMonthSaved').value),
                maxYearSaved: parseInt(document.getElementById('maxYearSaved').value),
                minMonthCreated: parseInt(document.getElementById('minMonthCreated').value),
                minYearCreated: parseInt(document.getElementById('minYearCreated').value),
                maxMonthCreated: parseInt(document.getElementById('maxMonthCreated').value),
                maxYearCreated: parseInt(document.getElementById('maxYearCreated').value),
            };

            console.log(filterVals)

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
          if(i % (maxGenres / 5) == 0){
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



    $(document).on("click", "#hypeBtn", function(){
      resetFilterValues();
      document.getElementById('danceMin').value = '.6';
      document.getElementById('danceMax').value = '1.00';
      document.getElementById('loudMin').value = '-20';
      document.getElementById('loudMax').value = '60';
      document.getElementById('tempoMin').value = '115';
      document.getElementById('tempoMax').value = '250';
      document.getElementById('energyMin').value = '.6';
      document.getElementById('energyMax').value = '1.00';
    });
    $(document).on("click", "#chillBtn", function(){
      resetFilterValues();
      document.getElementById('danceMin').value = '0.00';
      document.getElementById('danceMax').value = '.75';
      document.getElementById('loudMin').value = '-60';
      document.getElementById('loudMax').value = '0';
      document.getElementById('tempoMin').value = '0';
      document.getElementById('tempoMax').value = '125';
      document.getElementById('energyMin').value = '0.00';
      document.getElementById('energyMax').value = '.75';
    });
    $(document).on("click", "#happyBtn", function(){
      resetFilterValues();
      document.getElementById('danceMin').value = '.5';
      document.getElementById('danceMax').value = '1.00';
      document.getElementById('energyMin').value = '.5';
      document.getElementById('energyMax').value = '1.00';
      document.getElementById('valenceMin').value = '.45';
      document.getElementById('valenceMax').value = '1.00';
    });
    $(document).on("click", "#sadBtn", function(){
      resetFilterValues();
      document.getElementById('danceMin').value = '0.00';
      document.getElementById('danceMax').value = '.75';
      document.getElementById('energyMin').value = '0.00';
      document.getElementById('energyMax').value = '.75';
      document.getElementById('valenceMin').value = '0.00';
      document.getElementById('valenceMax').value = '.6';
    });

    $(document).on("click", "#resetBtn", function(){
        console.log('click')
        if(document.getElementById('playlistTable') != null){document.getElementById("playlistTable").remove();}
        if(document.getElementById('pTotal') != null){document.getElementById("pTotal").remove();}
        if(document.getElementById('pName') != null){document.getElementById("pName").remove();}
        document.getElementById("downloadBtn").disabled = true;
        document.getElementById("resetBtn").disabled = true;

        //enable all filter value fields
        toggleFilterActive(false);
        for(let i = 1; i < maxGenres + 1; i++){
          document.getElementById("genre" + i).disabled = false;
        }

    })

    $(document).on("click", "#downloadBtn", function(){
      downloadPlaylist(songJson);

    })


    let pTableSong= true;
    let pTableArtist= true;
    let pTableDance= true;
    let pTableEnergy= true;
    let pTableLoud= true;
    let pTableTempo= true;
    let pTableInstru= true;
    let pTableValence= true;
    let pTableDate = true;
    let pTableReleaseDate = true;
    let pTablePop = true;
    let pTableAcoust = true;
    let pTableSpeech = true;
    let pTableLive = true;


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
    $(document).on("click", "#pTableInstru", function(){
      console.log("click table instru");
      console.log(pTableInstru)
      sortPlaylist(songJson, songAttrJson, "instrumentalness", pTableInstru)
      pTableInstru = !pTableInstru;
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

    $(document).on("click", "#pTablePop", function(){
      console.log("click table pop");
      console.log(pTablePop)
      sortPlaylist(songJson, songAttrJson, "popularity", pTablePop)
      pTablePop = !pTablePop;
    });

    $(document).on("click", "#pTableSpeech", function(){
      console.log("click table speech");
      console.log(pTableSpeech)
      sortPlaylist(songJson, songAttrJson, "speechiness", pTableSpeech)
      pTableSpeech = !pTableSpeech;
    });

    $(document).on("click", "#pTableLive", function(){
      console.log("click table live");
      console.log(pTableLive)
      sortPlaylist(songJson, songAttrJson, "liveness", pTableLive)
      pTableLive = !pTableLive;
    });

    $(document).on("click", "#pTableReleaseDate", function(){
      console.log("click table release date");
      console.log(pTableReleaseDate)
      sortPlaylist(songJson, songAttrJson, "release_Date", pTableReleaseDate)
      pTableReleaseDate = !pTableReleaseDate;
    });

    $(document).on("click", "#pTableAcoust", function(){
      console.log("click table acoust");
      console.log(pTableAcoust)
      sortPlaylist(songJson, songAttrJson, "acousticness", pTableAcoust)
      pTableAcoust = !pTableAcoust;
    });

    $(document).on("click", "#page1", function(){
      if(!document.getElementById('playlistTable')){return;}
      document.getElementById("prevPage").classList.add('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page1").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');

      pageController(0, songJson, songAttrJson);

    });

    $(document).on("click", "#page2", function(){
      if(!document.getElementById('playlistTable')){return;}
      if(Object.keys(songJson).length <= 50){return;}
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page2").classList.add('is-current');
      document.getElementById("page1").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      pageController(1, songJson, songAttrJson);

    });
    $(document).on("click", "#page3", function(){
      if(!document.getElementById('playlistTable')){return;}
      if(Object.keys(songJson).length <= 100){return;}
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page3").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page1").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      pageController(2, songJson, songAttrJson);

    });
    $(document).on("click", "#page4", function(){
      if(!document.getElementById('playlistTable')){return;}
      if(Object.keys(songJson).length <= 150){return;}
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page4").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page1").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      pageController(3, songJson, songAttrJson);

    });
    $(document).on("click", "#page5", function(){
      if(!document.getElementById('playlistTable')){return;}
      if(Object.keys(songJson).length <= 200){return;}
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.add('is-disabled');
      document.getElementById("page5").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page1").classList.remove('is-current');
      pageController(4, songJson, songAttrJson);

    });

    $(document).on("click", "#prevPage", function(){
      let currPage = parseInt(document.getElementsByClassName('is-current')[0].getAttribute('aria-label')) - 1;
      $('#page' + currPage).trigger('click');
    });

    $(document).on("click", "#nextPage", function(){
      let currPage = parseInt(document.getElementsByClassName('is-current')[0].getAttribute('aria-label')) + 1;
      $('#page' + currPage).trigger('click');
    });
  };


  $(document).ready(function() {
    getToken();
    loadPage();

    //getSongs();
  });


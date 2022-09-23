
let access_token = "";
let refresh_token = "";
let topGenres = {};

export const renderPage = function() {
    return `<section class="hero is-success is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head has-background-black-bis">
      <header class="navbar">
        <div class="container has-background-black-bis">
          <div id="navbarMenuHeroC" class="navbar-menu has-background-black-bis">
            <div class="navbar-start">
              <a class="navbar-item is-active">
                Home
              </a>
              <a class="navbar-item">
                Top Songs
              </a>
              <a class="navbar-item">
                Top Artists
              </a>
              <a class="navbar-item">
                Top Genres
              </a>
              <a class="navbar-item">
                Playlist Generator
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div id="main" class="container has-text-centered">
        <p class="title is-1"><span id="loadTitle"> Loading (stealing) your Songs, Genres, Artists, etc. (data)... </span></p>
        <br>
        <button id="loadBtn" class="button is-link is-light is-large is-outlined is-rounded" disabled> Continue </button>
      </div>

    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
    </div>
  </section>`
  };

  async function loadGenres(maxGenres, offset) {
    //set max songs used in spotify api call
    let maxSongs = 50;
    let maxArtists = 50;

    //list of artist ids, object for counting genre frequency, object for storing each artists genres
    let artistIds = [];
    let genreCount = {};
    let artistGenres = {};
    let userSongs = {};

    //Get all users save songs
    do{
      const url = 'https://api.spotify.com/v1/me/tracks?limit='+ maxSongs + '&offset=' + (offset * maxSongs);
      const headers = {
        Authorization: 'Bearer ' + access_token
      }

      const response = await fetch(url, { headers });

      const data = await response.json();


      //If response is empty break the loop
      if(data.items.length === 0){
        console.log("no more songs");
        break;
      }

      // For every song called (50)
      for(let i = 1; i < maxSongs + 1; i++){
        if( data.items[i-1] == null){
          console.log("donezo");
          break;
        }

        //Add the artist id to array if it does not exist
        if(!(artistIds.includes(data.items[i-1].track.artists[0].id))){
          artistIds.push(data.items[i-1].track.artists[0].id)
        }

      }

      offset++;
    }while(true);

    //for every group of 50 IDs in array
    //limit of 50 a time in call
    // have to increment by 50
    offset=0;
    for(let i = 1; i < artistIds.length; i+= maxArtists){
      let idGroup='';
      //Add the IDs to the ID group to be used - 50 at a time
      for(let j = offset; j < offset + maxArtists; j++){
        idGroup+= artistIds[j];
        if(j+1 < offset + maxArtists){
          idGroup+=',';
        }
        else{
          break;
        }
      }
      offset+=maxArtists;

      //Call get artists on 50 ids collected
      const url = 'https://api.spotify.com/v1/artists?ids='+ idGroup;
      const headers = {
        Authorization: 'Bearer ' + access_token
      }

      const response = await fetch(url, { headers });

      const data = await response.json();

      //For every artist
      for(let k = 0; k < Object.keys(data.artists).length; k++){
        if(data.artists[k] == null){
          break;
        }
        let tempGenreList = [];
        //for every genre the artist has
        for(let l = 0; l < data.artists[k].genres.length; l++){
          //Push the genre to array for that artist
          tempGenreList.push(data.artists[k].genres[l]);

          //If genre is not present in our genre counter - add it and set to 1
          //otherwise - increment by 1
          if(!(data.artists[k].genres[l] in genreCount)){
            genreCount[data.artists[k].genres[l]] = 1;
          }
          else{
            genreCount[data.artists[k].genres[l]]++;
          }
        }

        //If the artist is not present in our object - add it
        if(!(data.artists[k].id in artistGenres)){
          artistGenres[data.artists[k].id] = tempGenreList;
        }
      }

    }

    //Sort genres in descending order
    let sortable = [];
    for (var genre in genreCount) {
      sortable.push([genre, genreCount[genre]]);
    }

    sortable.sort(function(a, b) {
      return b[1] - a[1];
    });

    let genreSorted = {};
    sortable.forEach(function(item){
        genreSorted[item[0]]=item[1]
    });


    //document.getElementById('genreTitle').textContent= "Your Top Genres: "

    //Set topGenres as sorted
    //set all the top genres in localstorage
    topGenres = genreSorted;
    let gCount =1;
    for(genre in topGenres){
      localStorage.setItem("genre" + gCount, genre)
      gCount++;

    }

    //Set the ArtistGenres in local storage
    localforage.setItem("artistGenres", artistGenres);
    localforage.setItem("topGenres", topGenres);
    localStorage.setItem('artistGenres', JSON.stringify(artistGenres));
    localStorage.setItem('topGenres', JSON.stringify(topGenres));
    console.log("genres done");

    document.getElementById("loadBtn").disabled = false;
    return;
  }

  async function loadArtists() {
    let maxArtists = 50;
    let artistInfo = '';

    const url = 'https://api.spotify.com/v1/me/top/artists?limit=' + maxArtists;
    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();

    localforage.setItem("topArtists", data.items);
    localStorage.setItem('topArtists', JSON.stringify(data.items));
    console.log("top artists done");
    return;
  }

  async function loadSongs() {
    let maxSongs = 50;
    let url = 'https://api.spotify.com/v1/me/top/tracks?limit='+ maxSongs;

    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();


    for(let i = 1; i < maxSongs + 1; i++){
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

        data.items[i-1].artist_string = songArtists;

    }
    localStorage.setItem('topSongs', JSON.stringify(data.items));
    localforage.setItem("topSongs", data.items);
    console.log("top songs done");

  }

  async function loadPlaylist() {

    const maxSongs = 50;
    let offset = 0;
    let songIds = [];
    let tempSongJson = {};
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
        //problemo
        if(data.items[i-1] == null){
          console.log("donezo");
          break;
        }


        tempSongJson[data.items[i-1].track.id] = data.items[i-1];
        songIds.push(data.items[i-1].track.id);
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
        tempSongJson[data.items[i-1].track.id].artist_string = songArtists;

      }

      offset++;
    }while(true);
    console.log(Object.keys(tempSongJson).length)
    let songString = JSON.stringify(tempSongJson);

    localforage.setItem("allSongs", tempSongJson);

    //songJson = tempSongJson;
    //songAttrJson = tempSongAttrJson;

    console.log("Playlist done")
    return;
  }

  export const getToken = function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    access_token = urlParams.get('access_token');
    refresh_token = urlParams.get('refresh_token');
    console.log(access_token + " : " + refresh_token)
  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());

    $(document).on("click", "#loadBtn", function(){
        console.log("go to user bro");
        location.href=`http://localhost:8080/api/user?access_token=${access_token}&refresh_token=${refresh_token}`;
    });
  };


  $(function() {
    getToken();
    loadPage();
    //loadUser();
    loadSongs();
    loadArtists();
    loadGenres(25,0);
    loadPlaylist();
    //$(document).on("click", "#loadBtn", window.open('http://localhost:8080/api/user', '_self'));
  });

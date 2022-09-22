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
            <a class="navbar-item is-active" onclick="location.href='http://localhost:8080/api/user?access_token=${access_token}&refresh_token=${refresh_token}'">
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
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/playlist?access_token=${access_token}&refresh_token=${refresh_token}'">
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
        <p class="title is-1">
        </p>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
    </div>
  </section>`
  };

  //Get token to use for auth from URL
  export const getToken = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    access_token = urlParams.get('access_token');
    refresh_token = urlParams.get('refresh_token');
    console.log(access_token + " : " + refresh_token)
    return;
  }

  async function loadGenres(maxGenres, offset) {
    //set max songs used in spotify api call
    let maxSongs = 50;
    let maxArtists = 50;

    //list of artist ids, object for counting genre frequency, object for storing each artists genres
    let artistIds = [];
    let genreCount = {};
    let artistGenres = {};
    let userSongs = {};

    //Genre title - with span to make it dynamic - append right away
    let genreInfo = '<p class="title" style="text-align: center"> <span id="genreTitle"> Loading your top genres... </span></p>';
    $('#main').append(genreInfo);

    //reset genre info
    //Add table header values
    genreInfo='';
    genreInfo+= '<table id="genreTable" class="table is-fullwidth is-hoverable">';
    genreInfo+= '<thead><tr><th class="has-text-left">Rank</th>';
    genreInfo+='<th class="has-text-centered"> Genre </th>'
    genreInfo+= '<th class="has-text-centered"> Artist Count</th>';
    genreInfo+='</tr></thead>';
    genreInfo+='<tbody id="genreTableBody">'

    //Get all users save songs
    do{
      const url = 'https://api.spotify.com/v1/me/tracks?limit='+ maxSongs + '&offset=' + (offset * maxSongs);
      const headers = {
        Authorization: 'Bearer ' + access_token
      }

      const response = await fetch(url, { headers });

      const data = await response.json();
      console.log(data)

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

      //dynamic Title fields
      if(offset == 40){
        document.getElementById('genreTitle').textContent= "Dang b you got a lot of songs.."
      }
      if(offset == 80){
        document.getElementById('genreTitle').textContent= "Get sum friends or sumthin.."
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
        if(offset == 2000){
          document.getElementById('genreTitle').textContent= "Dont fret, they are coming.."
        }
        if(offset == 4000){
          document.getElementById('genreTitle').textContent= "Pretty close now.."
        }
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
          console.log("adding")
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

    // For every genre (until max) add table info
    let count = 1;
    for(var genre in genreSorted){
      genreInfo+='<tr><th>' + count + '</th>';
      genreInfo+='<td>' + genre + '</td>';
      genreInfo+='<td>' + genreSorted[genre] + '</td>';
      genreInfo+='</tr>';
      count++;
      if(count > maxGenres){break;};
    }

    genreInfo+='</tbody>';
    genreInfo+='</table>';
    //Update text field of title
    document.getElementById('genreTitle').textContent= "Your Top Genres: "

    //Set topGenres as sorted
    //set all the top genres in localstorage
    topGenres = genreSorted;
    let gCount =1;
    for(genre in topGenres){
      localStorage.setItem("genre" + gCount, genre)
      gCount++;

    }

    //Set the ArtistGenres in local storage
    localStorage.setItem('artistGenres', JSON.stringify(artistGenres));
    localStorage.setItem('topGenres', JSON.stringify(genreSorted));

    //Append html to main
    $('#main').append(genreInfo);
    return;
  }

  function getGenres(maxGenres){
    //Genre title - with span to make it dynamic
    let genreInfo = '<p class="title" style="text-align: center"> <span id="genreTitle"> Your Top Genres: </span></p>';
    genreInfo+= '<table id="genreTable" class="table is-fullwidth is-hoverable">';
    genreInfo+= '<thead><tr><th class="has-text-left">Rank</th>';
    genreInfo+='<th class="has-text-centered"> Genre </th>'
    genreInfo+= '<th class="has-text-centered"> Artist Count </th>';
    genreInfo+='</tr></thead>';
    genreInfo+='<tbody id="genreTableBody">'

    // For every genre (until max) add table info
    let count = 1;
    topGenres = JSON.parse(localStorage.getItem('topGenres'));
    for(var genre in topGenres){
      genreInfo+='<tr><th>' + count + '</th>';
      genreInfo+='<td>' + genre + '</td>';
      genreInfo+='<td>' + topGenres[genre] + '</td>';
      genreInfo+='</tr>';
      count++;
      if(count > maxGenres){break;};
    }

    genreInfo+='</tbody>';
    genreInfo+='</table>';
    console.log("quick");
    //Append html to main
    $('#main').append(genreInfo);
    return;
  }

  async function oldGetGenres(){
    let maxArtists = 50;
    let genreInfo = '<p class="title" style="text-align: center"> YOUR TOP SPOTIFY GENRES: </p>'
    const url = 'https://api.spotify.com/v1/me/top/artists?limit=' + maxArtists;
    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();

    genreInfo+= '<table id="genreTable" class="table is-fullwidth is-hoverable">';
    genreInfo+= '<thead><tr><th class="has-text-left">Rank</th>';
    genreInfo+='<th class="has-text-centered"> Genre </th>'
    genreInfo+= '<th class="has-text-centered"> Artist Count </th>';
    genreInfo+='<th class="has-text-centered">Your Top Artist for Genre</th>';
    genreInfo+='</tr></thead>';
    genreInfo+='<tbody id="genreTableBody">'

    let genreCount = {};
    let genreTopArtist = {};

    for(let i = 1; i < maxArtists + 1; i++){
      for(let j = 0; j < data.items[i-1].genres.length; j++){
        if(!(data.items[i-1].genres[j] in genreCount)){
          genreCount[data.items[i-1].genres[j]] = 1;
          genreTopArtist[data.items[i-1].genres[j]] = data.items[i-1].name;
        }
        else{
          genreCount[data.items[i-1].genres[j]]++;
        }
      }
    }

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

    let count = 1;
    for(var genre in genreSorted){
      genreInfo+='<tr><th>' + count + '</th>';
      genreInfo+='<td>' + genre + '</td>';
      genreInfo+='<td>' + genreSorted[genre] + '</td>';
      genreInfo+='<td>' + genreTopArtist[genre] + '</td>';
      genreInfo+='</tr>';
      count++;
      if(count > maxGenres){break;};
    }

    genreInfo+='</tbody>';
    genreInfo+='</table>';

    $('#main').append(genreInfo);
  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());
  };


  $(function() {
    getToken();
    loadPage();
    if(localStorage.getItem('artistGenres') === null){
      loadGenres(25, 0);
    }
    else{
      getGenres(25);
    }

  });

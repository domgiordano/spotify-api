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
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/wrapped?access_token=${access_token}&refresh_token=${refresh_token}'">
              Wrapped
            </a>
          </div>
          </div>
        </div>
      </header>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div id="main" class="container has-text-centered">
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
      <nav class="pagination is-centered is-rounded is-large" role="navigation" aria-label="pagination">
        <a id="prevPage" class="pagination-previous is-disabled" title="This is the first page">Previous Page</a>
        <a id="nextPage" class="pagination-next">Next page</a>
        <ul class="pagination-list">
          <li>
            <a id="page1" class="pagination-link is-current" aria-label="1">1</a>
          </li>
        </ul>
      </nav>
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

  async function getWrapped(userID){
    console.log(userID)

    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    // Call API to get all users playlists
    const playlistsURL = 'https://api.spotify.com/v1/users/'+ userID +'/playlists?limit=50'
    const playlistResponse = await fetch(playlistsURL, { headers });
    const playlistData = await playlistResponse.json();

    // Grab Playlist IDs for Current Year and last years spotify wrapped
    let currentWrapped = null;
    let lastWrapped = null;
    let playlists = playlistData.items
    for(let i in playlists){
      if(playlists[i].name == "Your Top Songs 2023"){
        currentWrapped = playlists[i];
        continue;
      }
      else if(playlists[i].name == "Your Top Songs 2022"){
        lastWrapped = playlists[i];
        continue;
      }
      if(currentWrapped != null && lastWrapped != null){
        break;
      }
    }
    // Call Playlist info api for Current Year and Last Years Spotify Wrapped
    const currentWrappedResponse = await fetch('https://api.spotify.com/v1/playlists/'+ currentWrapped.id +'/tracks', { headers });
    const lastWrappedResponse = await fetch('https://api.spotify.com/v1/playlists/'+ lastWrapped.id +'/tracks', { headers });
    const currentWrappedData = await currentWrappedResponse.json();
    const lastWrappedData = await lastWrappedResponse.json();

    // Gather Data from playlists:
    //    - Find duplicate tracks
    //        - Get their previous ranking, current ranking, and delta ranking
    //        - Get the songs popularity
    //    - Calculate average popularity of songs liked by year
    //    - Get list of IDs of tracks for audio features api call
    let duplicateTracks = [];
    let currentWrappedPop = 0.0;
    let lastWrappedPop = 0.0;
    let currentWrappedIDs = "ids=";
    let lastWrappedIDs = "ids=";
    for(let cwTrackIndex in currentWrappedData.items){
      for(let lwTrackIndex in lastWrappedData.items){
        if(currentWrappedData.items[cwTrackIndex].track.id == lastWrappedData.items[lwTrackIndex].track.id){
          duplicateTracks.push({
            "id": currentWrappedData.items[cwTrackIndex].track.id,
            "name": currentWrappedData.items[cwTrackIndex].track.name,
            "currRank": cwTrackIndex,
            "prevRank": lwTrackIndex,
            "deltaRank": lwTrackIndex - cwTrackIndex,
            "popularity": currentWrappedData.items[cwTrackIndex].track.popularity
          })
        }

      }
      currentWrappedIDs += currentWrappedData.items[cwTrackIndex].track.id + ",";
      lastWrappedIDs += lastWrappedData.items[cwTrackIndex].track.id + ",";
      currentWrappedPop += currentWrappedData.items[cwTrackIndex].track.popularity;
      lastWrappedPop += lastWrappedData.items[cwTrackIndex].track.popularity;
    }
    //Sorts Dictionary by Delta rank change - bigget risers to biggest fallers
    duplicateTracks.sort(function(a,b){
      return b.deltaRank - a.deltaRank;
    })

    // Call Audio Features API - Cut off trailing comma on ids list
    const cwTrackFeaturesURL = 'https://api.spotify.com/v1/audio-features?' + currentWrappedIDs.slice(0,-1);
    const lwTrackFeaturesURL = 'https://api.spotify.com/v1/audio-features?' + lastWrappedIDs.slice(0,-1);
    const cwTrackFeaturesResonse = await fetch(cwTrackFeaturesURL, { headers });
    const lwTrackFeaturesResonse = await fetch(lwTrackFeaturesURL, { headers });
    const cwTrackFeaturesData = await cwTrackFeaturesResonse.json();
    const lwTrackFeaturesData = await lwTrackFeaturesResonse.json();

    console.log(cwTrackFeaturesData);
    console.log(lwTrackFeaturesData);

    return;
  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());
  };


  $(function() {
    getToken();
    loadPage();
    localforage.getItem('user').then(function(user) {
      getWrapped(user.id);
    });

  });

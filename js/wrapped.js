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
            <a class="navbar-item" onclick="location.href='http://localhost:8080/api/playlist?access_token=${access_token}&refresh_token=${refresh_token}'">
              Playlist Generator
            </a>
            <a class="navbar-item is-active" onclick="location.href='http://localhost:8080/api/wrapped?access_token=${access_token}&refresh_token=${refresh_token}'">
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
        <p id="artistsHeader" class="title" style="text-align: center"> SPOTIFY WRAPPED: 2023 v. 2022 </p>
        <div class="tabs is-medium is-centered is-toggle is-toggle-rounded">
          <ul>
            <li id="top10" class="is-active"><a>Top 10</a></li>
            <li id="top25" ><a>Top 25</a></li>
            <li id="top50" ><a>Top 50</a></li>
            <li id="top100" ><a>Top 100</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
      <nav class="pagination is-centered is-rounded is-large" role="navigation" aria-label="pagination">
        <a id="prevPage" class="pagination-previous is-disabled" title="This is the first page">Previous Page</a>
        <a id="nextPage" class="pagination-next is-disabled">Next page</a>
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

  async function getWrapped(userID, currentTerm){
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
    let currentWrappedPop = {
      "total": 0.0,
      "top10": 0.0,
      "top25": 0.0,
      "top50": 0.0,
      "top100": 0.0
    };
    let lastWrappedPop = {
      "total": 0.0,
      "top10": 0.0,
      "top25": 0.0,
      "top50": 0.0,
      "top100": 0.0
    };
    let currentWrappedIDs = "ids=";
    let lastWrappedIDs = "ids=";
    for(let cwTrackIndex in currentWrappedData.items){
      for(let lwTrackIndex in lastWrappedData.items){
        if(currentWrappedData.items[cwTrackIndex].track.id == lastWrappedData.items[lwTrackIndex].track.id){
          console.log("yo")
          console.log(currentWrappedData.items[cwTrackIndex])
          duplicateTracks.push({
            "id": currentWrappedData.items[cwTrackIndex].track.id,
            "name": currentWrappedData.items[cwTrackIndex].track.name,
            "artist": currentWrappedData.items[cwTrackIndex].track.artists[0].name,
            "cover": currentWrappedData.items[cwTrackIndex].track.album.images[0].url,
            "currRank": cwTrackIndex,
            "prevRank": lwTrackIndex,
            "deltaRank": lwTrackIndex - cwTrackIndex,
            "popularity": currentWrappedData.items[cwTrackIndex].track.popularity
          })
        }

      }
      currentWrappedIDs += currentWrappedData.items[cwTrackIndex].track.id + ",";
      lastWrappedIDs += lastWrappedData.items[cwTrackIndex].track.id + ",";
      currentWrappedPop.total += currentWrappedData.items[cwTrackIndex].track.popularity;
      lastWrappedPop.total += lastWrappedData.items[cwTrackIndex].track.popularity;
      if(cwTrackIndex == 9){
        currentWrappedPop["top10"] = currentWrappedPop.total / 10;
        lastWrappedPop["top10"] = lastWrappedPop.total / 10;
      }
      else if(cwTrackIndex == 24){
        currentWrappedPop["top25"] = currentWrappedPop.total / 25;
        lastWrappedPop["top25"] = lastWrappedPop.total / 25;
      }
      else if(cwTrackIndex == 49){
        currentWrappedPop["top50"] = currentWrappedPop.total / 50;
        lastWrappedPop["top50"] = lastWrappedPop.total / 50;
      }
    }
    currentWrappedPop["top100"] = currentWrappedPop.total / 100;
    lastWrappedPop["top100"] = lastWrappedPop.total / 100;

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
    let cwAudioFeatureData = {
      "totals": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top10": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top25": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top50": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top100": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      }
    }
    let lwAudioFeatureData = {
      "totals": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top10": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top25": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top50": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      },
      "top100": {
        "acousticness": 0.0,
        "danceability": 0.0,
        "energy": 0.0,
        "instrumentalness": 0.0,
        "liveness": 0.0,
        "speechiness": 0.0,
        "tempo": 0.0,
        "valence": 0.0
      }
    }
    for(let i in cwTrackFeaturesData.audio_features){
      //Update Totals amounts
      cwAudioFeatureData, lwAudioFeatureData = getFeatureDataTotals(cwAudioFeatureData, lwAudioFeatureData,
        cwTrackFeaturesData.audio_features[i], lwTrackFeaturesData.audio_features[i]);
      if(i == 9){
        cwAudioFeatureData, lwAudioFeatureData = updateAverages(cwAudioFeatureData, lwAudioFeatureData, 10);
      }
      else if(i == 24){
        cwAudioFeatureData, lwAudioFeatureData = updateAverages(cwAudioFeatureData, lwAudioFeatureData, 25);
      }
      else if(i == 49){
        cwAudioFeatureData, lwAudioFeatureData = updateAverages(cwAudioFeatureData, lwAudioFeatureData, 50);
      }
    }
    cwAudioFeatureData, lwAudioFeatureData = updateAverages(cwAudioFeatureData, lwAudioFeatureData, 100);
    console.log(cwAudioFeatureData)
    console.log(lwAudioFeatureData)

    let wrappedData = {
      "cwAudioFeatureData": cwAudioFeatureData,
      "lwAudioFeatureData": lwAudioFeatureData,
      "currentWrappedPop": currentWrappedPop,
      "lastWrappedPop": lastWrappedPop,
      "duplicateTracks": duplicateTracks
    }
    localforage.setItem("wrappedData", wrappedData)
    loadWrapped(currentTerm, wrappedData)
    return;
  }

  function loadWrapped(currentTerm, wrappedData){
    if(document.getElementById('wrappedTable')){
      document.getElementById('wrappedTitle').remove();
      document.getElementById('wrappedTable').remove();
      document.getElementById('duplicateTitle').remove();
      document.getElementById('duplicateTable').remove();
    }
    // Build Display
    console.log(currentTerm)
    let cwAudioFeatureData = wrappedData["cwAudioFeatureData"];
    let lwAudioFeatureData = wrappedData["lwAudioFeatureData"];
    let currentWrappedPop = wrappedData["currentWrappedPop"];
    let lastWrappedPop = wrappedData["lastWrappedPop"];

    let wrappedInfo = '<p id="wrappedTitle" class="title" style="text-align: center"> <span id="wrappedTitle"> Wrapped Metrics Comparison: </span></p>';
    wrappedInfo+='<table id="wrappedTable" class="table is-fullwidth is-hoverable">';
    wrappedInfo+= '<thead><tr><th class="has-text-left">Metric</th>';
    wrappedInfo+='<th class="has-text-centered"> 2022 </th>'
    wrappedInfo+='<th class="has-text-centered"> 2023 </th>'
    wrappedInfo+='<th class="has-text-centered"> Change </th>'
    wrappedInfo+='</tr></thead>';
    wrappedInfo+='<tbody id="wrappedTableBody">'
    for(let metric in cwAudioFeatureData[currentTerm]){
      let cwMetricVal = Math.round(cwAudioFeatureData[currentTerm][metric] *100);
      let lwMetricVal = Math.round(lwAudioFeatureData[currentTerm][metric] * 100);
      if(metric == "tempo"){
        lwMetricVal = lwMetricVal / 100;
        cwMetricVal = cwMetricVal / 100;
      }
      let netMetricVal = Math.round((cwMetricVal - lwMetricVal) * 100) / 100;
      wrappedInfo+='<tr><th>' + metric + '</th>';
      wrappedInfo+='<td>' + lwMetricVal + '</td>';
      wrappedInfo+='<td>' + cwMetricVal + '</td>';
      wrappedInfo+='<td>' + netMetricVal + '</td>';
      wrappedInfo+='</tr>';
    }

    let netPopVal = Math.round((currentWrappedPop[currentTerm]-lastWrappedPop[currentTerm]) * 100) / 100;
    wrappedInfo+='<tr><th>popularity</th>';
    wrappedInfo+='<td>' + lastWrappedPop[currentTerm] + '</td>';
    wrappedInfo+='<td>' + currentWrappedPop[currentTerm] + '</td>';
    wrappedInfo+='<td>' + netPopVal + '</td>';
    wrappedInfo+='</tr>';

    wrappedInfo+='</tbody>';
    wrappedInfo+='</table>';

    // Duplicates Table
    let duplicateTracks = wrappedData['duplicateTracks'];

    wrappedInfo+= '<p id="duplicateTitle" class="title" style="text-align: center"> <span id="duplicateTitle"> Wrapped Duplicate Tracks: </span></p>';
    wrappedInfo+= '<table id="duplicateTable" class="table is-fullwidth is-hoverable">';
    wrappedInfo+= '<thead><tr><th class="has-text-left">Cover</th>';
    wrappedInfo+='<th class="has-text-centered"> Track </th>'
    wrappedInfo+='<th class="has-text-centered"> Artist </th>'
    wrappedInfo+='<th class="has-text-centered"> 2022 Rank </th>'
    wrappedInfo+='<th class="has-text-centered"> 2023 Rank </th>'
    wrappedInfo+='<th class="has-text-centered"> Rank Change </th>'
    wrappedInfo+='</tr></thead>';
    wrappedInfo+='<tbody id="duplicateTableBody">'

    for(let track in duplicateTracks){
      wrappedInfo+='<tr><th><img src="' + duplicateTracks[track].cover + '" alt="Placeholder image" width="100" height="100"></img></th>';
      wrappedInfo+='<td>' + duplicateTracks[track].name + '</td>';
      wrappedInfo+='<td>' + duplicateTracks[track].artist + '</td>';
      wrappedInfo+='<td>' + duplicateTracks[track].prevRank + '</td>';
      wrappedInfo+='<td>' + duplicateTracks[track].currRank + '</td>';
      wrappedInfo+='<td>' + (duplicateTracks[track].prevRank - duplicateTracks[track].currRank) + '</td>';
      wrappedInfo+='</tr>';
    }
    wrappedInfo+='</tbody>';
    wrappedInfo+='</table>';
    //Append html to main
    $('#main').append(wrappedInfo);
  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());
  };


  $(function() {
    getToken();
    loadPage();
    localforage.getItem('user').then(function(user) {
      getWrapped(user.id, "top10");
    });

    let currentTerm = "top10";
    $(document).on("click", "#top10", function(){
      document.getElementById("top10").classList.add('is-active');
      document.getElementById("top25").classList.remove('is-active');
      document.getElementById("top50").classList.remove('is-active');
      document.getElementById("top100").classList.remove('is-active');
      currentTerm ="top10";
      $('#page1').trigger('click');
    });
    $(document).on("click", "#top25", function(){
      document.getElementById("top10").classList.remove('is-active');
      document.getElementById("top25").classList.add('is-active');
      document.getElementById("top50").classList.remove('is-active');
      document.getElementById("top100").classList.remove('is-active');
      currentTerm ="top25";
      $('#page1').trigger('click');
    });
    $(document).on("click", "#top50", function(){
      document.getElementById("top10").classList.remove('is-active');
      document.getElementById("top25").classList.remove('is-active');
      document.getElementById("top50").classList.add('is-active');
      document.getElementById("top100").classList.remove('is-active');
      currentTerm ="top50";
      $('#page1').trigger('click');
    });
    $(document).on("click", "#top100", function(){
      document.getElementById("top10").classList.remove('is-active');
      document.getElementById("top25").classList.remove('is-active');
      document.getElementById("top50").classList.remove('is-active');
      document.getElementById("top100").classList.add('is-active');
      currentTerm ="top100";
      $('#page1').trigger('click');
    });

    $(document).on("click", "#page1", function(){
      document.getElementById("prevPage").classList.add('is-disabled');
      document.getElementById("nextPage").classList.add('is-disabled');
      document.getElementById("page1").classList.add('is-current');
      localforage.getItem("wrappedData").then(function(wrappedData) {
        loadWrapped(currentTerm, wrappedData);
      });

    });

  });

  function getFeatureDataTotals(cwTrackData, lwTrackData, cwTrack, lwTrack){
    // Current Wrapped Track
    cwTrackData.totals.acousticness += cwTrack.acousticness
    cwTrackData.totals.danceability += cwTrack.danceability
    cwTrackData.totals.energy += cwTrack.energy
    cwTrackData.totals.instrumentalness += cwTrack.instrumentalness
    cwTrackData.totals.liveness += cwTrack.liveness
    cwTrackData.totals.speechiness += cwTrack.speechiness
    cwTrackData.totals.tempo += cwTrack.tempo
    cwTrackData.totals.valence += cwTrack.valence
    // Last Wrapped Track
    lwTrackData.totals.acousticness += lwTrack.acousticness
    lwTrackData.totals.danceability += lwTrack.danceability
    lwTrackData.totals.energy += lwTrack.energy
    lwTrackData.totals.instrumentalness += lwTrack.instrumentalness
    lwTrackData.totals.liveness += lwTrack.liveness
    lwTrackData.totals.speechiness += lwTrack.speechiness
    lwTrackData.totals.tempo += lwTrack.tempo
    lwTrackData.totals.valence += lwTrack.valence
    return cwTrackData, lwTrackData;
  }

  function updateAverages(cwTrackData, lwTrackData, cutoff){
    for(let i in cwTrackData["top"+ String(cutoff)]){
      cwTrackData["top"+ String(cutoff)][i] = cwTrackData.totals[i] / cutoff;
      lwTrackData["top"+ String(cutoff)][i] = lwTrackData.totals[i] / cutoff;
    }
    return cwTrackData, lwTrackData;
  }

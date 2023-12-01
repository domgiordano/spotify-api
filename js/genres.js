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
          <li>
            <a id="page2" class="pagination-link" aria-label="2">2</a>
          </li>
          <li>
            <a id="page3" class="pagination-link" aria-label="3">3</a>
          </li>
          <li>
            <a id="page4" class="pagination-link" aria-label="4">4</a>
          </li>
          <li>
            <a id="page5" class="pagination-link" aria-label="5">5</a>
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

  function getGenres(offset, topGenres){
    //Genre title - with span to make it dynamic
    if(document.getElementById('genreTable')){
      document.getElementById('genreTitle').remove();
      document.getElementById('genreTable').remove();
    }

    let maxGenres = 25;
    console.log(topGenres);
    let genreInfo = '<p id="genreTitle" class="title" style="text-align: center"> <span id="genreTitle"> Your Top Genres: </span></p>';
    genreInfo+= '<table id="genreTable" class="table is-fullwidth is-hoverable">';
    genreInfo+= '<thead><tr><th class="has-text-left">Rank</th>';
    genreInfo+='<th class="has-text-centered"> Genre </th>'
    genreInfo+= '<th class="has-text-centered"> Artist Count </th>';
    genreInfo+='</tr></thead>';
    genreInfo+='<tbody id="genreTableBody">'

    // For every genre (until max) add table info
    let count = 1;
    //topGenres = JSON.parse(localStorage.getItem('topGenres'));
    for(var genre in topGenres){
      if(count >= maxGenres * offset){
        console.log('made it');
        genreInfo+='<tr><th>' + count + '</th>';
        genreInfo+='<td>' + genre + '</td>';
        genreInfo+='<td>' + topGenres[genre] + '</td>';
        genreInfo+='</tr>';
        if(count >= maxGenres *(offset + 1)){break;};
      }
      count++;
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
    localforage.getItem('topGenres').then(function(topGenres) {
      getGenres(0, topGenres);
    });

    $(document).on("click", "#page1", function(){
      document.getElementById("prevPage").classList.add('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page1").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      localforage.getItem('topGenres').then(function(topGenres) {
        getGenres(0, topGenres);
      });

    });

    $(document).on("click", "#page2", function(){
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page2").classList.add('is-current');
      document.getElementById("page1").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      localforage.getItem('topGenres').then(function(topGenres) {
        getGenres(1, topGenres);
      });

    });
    $(document).on("click", "#page3", function(){
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page3").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page1").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      localforage.getItem('topGenres').then(function(topGenres) {
        getGenres(2, topGenres);
      });

    });
    $(document).on("click", "#page4", function(){
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page4").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page1").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      localforage.getItem('topGenres').then(function(topGenres) {
        getGenres(3, topGenres);
      });

    });
    $(document).on("click", "#page5", function(){
      document.getElementById("prevPage").classList.remove('is-disabled');
      document.getElementById("nextPage").classList.add('is-disabled');
      document.getElementById("page5").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page1").classList.remove('is-current');
      localforage.getItem('topGenres').then(function(topGenres) {
        getGenres(4, topGenres);
      });

    });

    $(document).on("click", "#prevPage", function(){
      let currPage = parseInt(document.getElementsByClassName('is-current')[0].getAttribute('aria-label')) - 1;
      $('#page' + currPage).trigger('click');
    });

    $(document).on("click", "#nextPage", function(){
      let currPage = parseInt(document.getElementsByClassName('is-current')[0].getAttribute('aria-label')) + 1;
      $('#page' + currPage).trigger('click');
    });

  });

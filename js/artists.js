let access_token = "";
let refresh_token = "";
let currentTerm = '';

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
            <a class="navbar-item is-active" onclick="location.href='http://localhost:8080/api/artists?access_token=${access_token}&refresh_token=${refresh_token}'">
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
        <p id="artistsHeader" class="title" style="text-align: center"> YOUR TOP SPOTIFY ARTISTS: </p>
        <div class="tabs is-medium is-centered is-toggle is-toggle-rounded">
          <ul>
            <li id="shortTerm" class="is-active"><a>Last 4 weeks</a></li>
            <li id="mediumTerm" ><a>Last 6 Months</a></li>
            <li id="longTerm" ><a>All Time</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
      <nav class="pagination is-centered is-rounded is-large" role="navigation" aria-label="pagination">
        <a id="prevPage" class="pagination-previous is-disabled" title="This is the first page">Previous Page</a>
        <a id="nextPage" class="pagination-next">Next page</a>
        <ul class="pagination-list">
          <li>
            <a id="page1" class="pagination-link is-current" aria-label="1" pagination-active-color="success">1</a>
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

  export const getToken = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    access_token = urlParams.get('access_token');
    refresh_token = urlParams.get('refresh_token');
    console.log(access_token + " : " + refresh_token)
    return;
  }

  async function getArtists(offset, topArtists) {
    let maxArtists = 10;
    let artistInfo = '';
    if(document.getElementById('cardGroup')){
      document.getElementById('cardGroup').remove();
    }

    artistInfo+='<div id="cardGroup" class="columns is-multiline">';

    for(let i = 1 + (maxArtists * offset); i < (maxArtists * (offset + 1)) + 1; i++){

        let artistGenres = "";
        for(let j = 0; j < topArtists[i-1].genres.length; j++){
            if(j == 0){
                artistGenres+= topArtists[i-1].genres[j];
            }
            else{
                artistGenres+= ", " + topArtists[i-1].genres[j];
            }

        }

        artistInfo+='<div id="card_' + (i) + '" class="column is-one-fifth" style="width: 20%">';
        artistInfo+='<div class="card-content" style="text-align: center">';
        artistInfo+='<div class="card-image"  style="background: white">';
        artistInfo+='<figure class="image is-square"><img src="' + topArtists[i-1].images[0].url + '" alt="Placeholder image"></figure>';
        artistInfo+='</div>';
        artistInfo+='<div class="media">';
        artistInfo+='<div class="media-content" ><p class="title is-4" style=" text-align: center">'+ i + ': ' + topArtists[i-1].name + '</p>';
        artistInfo+='<p class="subtitle is-6" style="text-align: center"> Genres: ' + artistGenres + ' </p>';
        artistInfo+='<p class="subtitle is-6" style="text-align: center"> Popularity: ' + topArtists[i-1].popularity + ' </p>';
        artistInfo+='</div></div></div></div>';
    }

    artistInfo+='</div>';
    $('#main').append(artistInfo);
  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());
  };


  $(function() {
    getToken();
    loadPage();
    currentTerm = "topShortTermArtists"
    localforage.getItem(currentTerm).then(function(topArtists) {
      getArtists(0, topArtists);
    });

    let offset = 0;

    $(document).on("click", "#shortTerm", function(){
      document.getElementById("mediumTerm").classList.remove('is-active');
      document.getElementById("longTerm").classList.remove('is-active');
      document.getElementById("shortTerm").classList.add('is-active');
      currentTerm ="topShortTermArtists";
      $('#page1').trigger('click');
    });
    $(document).on("click", "#mediumTerm", function(){
      document.getElementById("shortTerm").classList.remove('is-active');
      document.getElementById("longTerm").classList.remove('is-active');
      document.getElementById("mediumTerm").classList.add('is-active');
      currentTerm ="topMediumTermArtists";
      $('#page1').trigger('click');
    });
    $(document).on("click", "#longTerm", function(){
      document.getElementById("shortTerm").classList.remove('is-active');
      document.getElementById("mediumTerm").classList.remove('is-active');
      document.getElementById("longTerm").classList.add('is-active');
      currentTerm ="topLongTermArtists";
      $('#page1').trigger('click');
    });

    $(document).on("click", "#page1", function(){
      document.getElementById("prevPage").classList.add('is-disabled');
      document.getElementById("nextPage").classList.remove('is-disabled');
      document.getElementById("page1").classList.add('is-current');
      document.getElementById("page2").classList.remove('is-current');
      document.getElementById("page3").classList.remove('is-current');
      document.getElementById("page4").classList.remove('is-current');
      document.getElementById("page5").classList.remove('is-current');
      localforage.getItem(currentTerm).then(function(topArtists) {
        getArtists(0, topArtists);
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
      localforage.getItem(currentTerm).then(function(topArtists) {
        getArtists(1, topArtists);
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
      localforage.getItem(currentTerm).then(function(topArtists) {
        getArtists(2, topArtists);
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
      localforage.getItem(currentTerm).then(function(topArtists) {
        getArtists(3, topArtists);
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
      localforage.getItem(currentTerm).then(function(topArtists) {
        getArtists(4, topArtists);
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

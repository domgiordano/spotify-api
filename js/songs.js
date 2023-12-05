//const $ = require('jquery');
let access_token = "";
let refresh_token = "";
let currentTerm ='';

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
            <a class="navbar-item is-active" onclick="location.href='http://localhost:8080/api/songs?access_token=${access_token}&refresh_token=${refresh_token}'">
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

    <div class="hero-body">
      <div id="main" class="container has-text-centered">
        <p id="songsHeader" class="title" style="text-align: center"> YOUR TOP SPOTIFY SONGS: </p>
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
    <div class="hero-foot">
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

  const getToken = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    access_token = urlParams.get('access_token');
    refresh_token = urlParams.get('refresh_token');
    console.log(access_token + " : " + refresh_token)
    return;
  }

  async function getSongs(offset, topSongs) {

    if(document.getElementById('cardGroup')){
      document.getElementById('cardGroup').remove();
    }
    let songInfo = '';
    songInfo+='<div id="cardGroup" class="columns is-multiline">';

    let maxSongs = 10;
    for(let i = 1 + (maxSongs * offset); i < (maxSongs * (offset + 1)) + 1; i++){
        let songName = topSongs[i-1].name;
        let songArtists = "";
        for(let j = 0; j < topSongs[i-1].artists.length; j++){
          if (j == 0) {
            songArtists += topSongs[i-1].artists[j].name;
          }
          else if (j == 1) {
            songArtists += " ft. " + topSongs[i-1].artists[j].name;
          }
          else {
            songArtists += " & " + topSongs[i-1].artists[j].name;
          }
        }
        songInfo+='<div id="card_' + (i) + '" class="column is-one-fifth" style="width: 20%">';
        songInfo+='<div class="card-content" style="text-align: center">';
        songInfo+='<div class="card-image"  style="background: white">';
        songInfo+='<figure class="image"><img src="' + topSongs[i-1].album.images[0].url + '" alt="Placeholder image"></figure>';
        songInfo+='</div>';
        songInfo+='<div class="media">';
        songInfo+='<div class="media-content" ><p class="title is-4" style=" text-align: center">'+ (i) + ': ' + songName + '</p>';
        songInfo+='<p class="subtitle is-6" style="text-align: center">' + songArtists + '</p>';
        songInfo+='</div></div></div></div>';


    }

    songInfo+='</div>';
    $('#main').append(songInfo);



  }

  const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());

  };


  $(document).ready(function() {
    getToken();
    loadPage();
    //getSongs(0);
    currentTerm="topShortTermSongs";
    localforage.getItem('topShortTermSongs').then(function(topSongs) {
      getSongs(0, topSongs);
    });
    let offset = 0;

    $(document).on("click", "#shortTerm", function(){
      document.getElementById("mediumTerm").classList.remove('is-active');
      document.getElementById("longTerm").classList.remove('is-active');
      document.getElementById("shortTerm").classList.add('is-active');
      currentTerm ="topShortTermSongs";
      $('#page1').trigger('click');
    });
    $(document).on("click", "#mediumTerm", function(){
      document.getElementById("shortTerm").classList.remove('is-active');
      document.getElementById("longTerm").classList.remove('is-active');
      document.getElementById("mediumTerm").classList.add('is-active');
      currentTerm ="topMediumTermSongs";
      $('#page1').trigger('click');
    });
    $(document).on("click", "#longTerm", function(){
      document.getElementById("shortTerm").classList.remove('is-active');
      document.getElementById("mediumTerm").classList.remove('is-active');
      document.getElementById("longTerm").classList.add('is-active');
      currentTerm ="topLongTermSongs";
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
      localforage.getItem(currentTerm).then(function(topSongs) {
        getSongs(0, topSongs);
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
      localforage.getItem(currentTerm).then(function(topSongs) {
        getSongs(1, topSongs);
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
      localforage.getItem(currentTerm).then(function(topSongs) {
        getSongs(2, topSongs);
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
      localforage.getItem(currentTerm).then(function(topSongs) {
        getSongs(3, topSongs);
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
      localforage.getItem(currentTerm).then(function(topSongs) {
        getSongs(4, topSongs);
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

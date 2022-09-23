let access_token = "";
let refresh_token = "";

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
          </div>
          </div>
        </div>
      </header>
    </div>

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

  export const getToken = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    access_token = urlParams.get('access_token');
    refresh_token = urlParams.get('refresh_token');
    console.log(access_token + " : " + refresh_token)
    return;
  }

  async function getSongs(offset, topSongs) {
    let songInfo = '';
    if(offset == 0) {
      songInfo+='<p id="songsHeader" class="title" style="text-align: center"> YOUR TOP SPOTIFY SONGS: </p>'
      songInfo+='<div id="cardGroup" class="columns is-multiline" style="margin-left: 0.025%">';
    }
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
        songInfo+='<div id="card_' + (i) + '" class="column is-one-quarter" style="margin: 1%; width: 31%">';
        songInfo+='<div class="card-content" style="text-align: center">';
        songInfo+='<div class="card-image"  style="background: white">';
        songInfo+='<figure class="image"><img src="' + topSongs[i-1].album.images[0].url + '" alt="Placeholder image"></figure>';
        songInfo+='</div>';
        songInfo+='<div class="media">';
        songInfo+='<div class="media-content" ><p class="title is-4" style=" text-align: center">'+ (i) + ': ' + songName + '</p>';
        songInfo+='<p class="subtitle is-6" style="text-align: center">' + songArtists + '</p>';
        songInfo+='</div></div></div></div>';


    }



    let moreButton = document.getElementById("moreBtn");
    let resetButton = document.getElementById("resetBtn");
    let buttonInfo ='<div><button id="moreBtn" class="button is-link is-light is-large is-outlined is-rounded"> Gimme more my guy </button><button id="resetBtn" class="button is-warning is-light is-large is-outlined is-rounded"> Reset Page pls. </button></div>';
    if (offset != 0){
        //playlist.innerHTML = '';
        moreButton.remove();
        resetButton.remove();
        $('#cardGroup').append(songInfo);
    }
    else{
      songInfo+='</div>';
      $('#main').append(songInfo);
    }

    $('#main').append(buttonInfo);

    if(offset == 4){
      $('#moreBtn').attr('disabled','disabled');
    }


  }

  export const loadPage = function() {

    const $root = $('#root');

    $root.append(renderPage());

  };


  $(function() {
    getToken();
    loadPage();
    getSongs(0);

    localforage.getItem('topSongs').then(function(topSongs) {
      getSongs(0, topSongs);
    });
    let offset = 0;

    $(document).on("click", "#moreBtn", function() {
      localforage.getItem('topSongs').then(function(topSongs) {
        getSongs(offset, topSongs);
      });
      offset+=1;
      console.log("more click");
    });

    $(document).on("click", "#resetBtn", function(){
      document.getElementById("cardGroup").remove();
      document.getElementById("moreBtn").remove();
      document.getElementById("resetBtn").remove();
      document.getElementById("songsHeader").remove();
      localforage.getItem('topSongs').then(function(topSongs) {
        getSongs(0, topSongs);
      });
      offset = 0;
  })
  });

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

  async function getArtists(maxArtists=25) {
    let artistInfo = '<p class="title" style="text-align: center"> YOUR TOP SPOTIFY ARTISTS: </p>'
    const url = 'https://api.spotify.com/v1/me/top/artists?limit=' + maxArtists;
    const headers = {
      Authorization: 'Bearer ' + access_token
    }

    const response = await fetch(url, { headers });

    const data = await response.json();

    artistInfo+='<div class="columns is-multiline" style="margin-left: 0.025%">';
    for(let i = 1; i < maxArtists + 1; i++){

        let artistGenres = "";
        for(let j = 0; j < data.items[i-1].genres.length; j++){
            if(j == 0){
                artistGenres+= data.items[i-1].genres[j];
            }
            else{
                artistGenres+= ", " + data.items[i-1].genres[j];
            }

        }

        artistInfo+='<div class="column is-one-quarter" style="margin: 1%; width: 31%">';
        artistInfo+='<div class="card-content" style="text-align: center">';
        artistInfo+='<div class="card-image"  style="background: white">';
        artistInfo+='<figure class="image is-square"><img src="' + data.items[i-1].images[0].url + '" alt="Placeholder image"></figure>';
        artistInfo+='</div>';
        artistInfo+='<div class="media">';
        artistInfo+='<div class="media-content" ><p class="title is-4" style=" text-align: center">'+ i + ': ' + data.items[i-1].name + '</p>';
        artistInfo+='<p class="subtitle is-6" style="text-align: center"> Genres: ' + artistGenres + ' </p>';
        artistInfo+='<p class="subtitle is-6" style="text-align: center"> Popularity: ' + data.items[i-1].popularity + ' </p>';
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
    getArtists();
  });

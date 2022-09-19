
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
          YOU GOT IN WUTS GUD
        </p>
      </div>

    </div>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot has-background-black-bis">
    </div>
  </section>`
  };

  async function getUser() {
    let userInfo = '<p class="title" style="text-align: center"> SPOTIFY USER INFO: </p>'
    const url = 'https://api.spotify.com/v1/me';
    const headers = {
      Authorization: 'Bearer ' + access_token
    }



    const response = await fetch(url, { headers });

    const data = await response.json();
    userInfo+= '<p class="subtitle style="text-align: center"> Username: ' + data.display_name + ' </p>';
    userInfo+= '<p class="subtitle style="text-align: center"> Id: ' + data.id + ' </p>';
    userInfo+= '<p class="subtitle style="text-align: center"> Followers: ' + data.followers.total + ' </p>';
    console.log(userInfo)
    $('#main').append(userInfo);
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
  };


  $(function() {
    getToken();
    loadPage();
    getUser();
  });

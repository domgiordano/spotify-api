
export const renderPage = function() {
    return `<section class="hero is-success is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head has-background-black-bis">
      <header class="navbar">
        <div class="container has-background-black-bis">
          <div id="navbarMenuHeroC" class="navbar-menu has-background-black-bis">
            <div class="navbar-start">
              <a class="navbar-item is-active" onclick="window.open('home.html', '_self')">
                Home
              </a>
              <a class="navbar-item" onclick="window.open('songs.html', '_self')">
                Top Songs
              </a>
              <a class="navbar-item" onclick="window.open('artists.html', '_self')">
                Top Artists
              </a>
              <a class="navbar-item" onclick="window.open('genres.html', '_self')">
                Top Genres
              </a>
              <a class="navbar-item" onclick="window.open('playlist.html', '_self')">
                Playlist Generator
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container has-text-centered">
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

  export const loadPage = function() {

    const $root = $('#root');


    $root.append(renderPage());
  };


  $(function() {
    loadPage();
  });

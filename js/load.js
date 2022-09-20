
export const renderPage = function() {
    console.log("render")
    return `<section class="hero is-success is-fullheight">
    <div class="hero-head has-background-black-bis">
      <header class="navbar">
        <div class="container has-background-black-bis">
          <div id="navbarMenuHeroC" class="navbar-menu has-background-black-bis">
            <div class="navbar-start">
              <a class="navbar-item is-active">
                Home
              </a>
              <a class="navbar-item">
                Top Songs
              </a>
              <a class="navbar-item">
                Top Artists
              </a>
              <a class="navbar-item">
                Top Genres
              </a>
              <a class="navbar-item">
                Playlist Generator
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>

    <div class="hero-body">
      <div class="container has-text-centered">
        <p class="title is-1">
          Loading (stealing) all of your songs (data)...
        </p>
      </div>
    </div>


    <div class="hero-foot has-background-black-bis">
    </div>
  </section>`;
  };

  export const loadPage = function() {

    console.log("load")
    const $root = $('#root');


    $root.append(renderPage());
  };


  $(function() {
    console.log("function");
    loadPage();

  });

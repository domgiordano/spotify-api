
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
            <a class="navbar-item" onclick="window.open('home.html', '_self')">
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
        SPOTIFY
      </p>
      <button id="loginBtn" onclick="loginSpotify()" class="button is-link is-light is-large is-outlined is-rounded">
          LOGIN
      </button>
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

export function loginSpotify() {
  console.log('click')
  app.get('/api', function(req, res) {
    res.redirect(process.env.LOGINURI)
  })
}

export async function buttonClick() {
  const pubRoot = new axios.create({
    baseURL: "http://localhost:3000/public"
  });
}

$(function() {
  console.log("function");
  loadPage();
  $(document).on("click", "#loginBtn", loginSpotify);
});

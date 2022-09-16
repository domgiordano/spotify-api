
const express = require('express');
const cors = require('cors');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);


require('dotenv').config();
const PORT = process.env.PORT || 8888;
const application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true}));
application.use(cors());

const AuthRoutes = require('./routes/authRoutes.js');
application.use('/api', cors(), AuthRoutes);

application.get('', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


application.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const renderPage = function() {
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
        XOMINICK'S SPOTIFY
      </p>
      <button id="loginBtn" class="button is-link is-light is-large is-outlined is-rounded">
          LOGIN
      </button>
    </div>
  </div>


  <div class="hero-foot has-background-black-bis">
  </div>
</section>`;
};

const loadPage = function() {

  console.log("load")
  const $root = $('#root');


  $root.append(renderPage());
};

function loginSpotify() {
  console.log('click')
  application.get('/api', function(req, res) {
    res.redirect(process.env.LOGINURI)
  })
}


$(function() {
  console.log("function");
  loadPage();
  $(document).on("click", "#loginBtn", loginSpotify);
});


const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const debug = require('debug');
const bearerToken = require('express-bearer-token');
require('dotenv').config();
var access_token = "";
var refresh_token = "";

// Loggers used. Environment variables used to limit output
const debugAutoWire = debug('auto-wire');
const debugAutoWireWarning = debug('auto-wire-warning');

const app = express();

const writeFS = function(fileLocation, data){
  fs.writeFileSync(fileLocation, data)
}
//app.use(require('morgan')('dev'));
//require('./data/DataStore');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bearerToken());
app.use(cookieParser());
app.use(cors());

// Configure the port to listen on
const PORT = process.env.PORT || 8080;
const AuthRoutes = require('./routes/authRoutes.js');
app.use('/api', express.static(path.join(__dirname, 'js')));
app.use('/api', express.static(path.join(__dirname, 'html')));
app.use('/api', express.static(__dirname));
app.use('/api', cors(), AuthRoutes);


app.set('access_token', access_token);
app.set('refresh_token', refresh_token);


// Call the listen() method on the server object
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = writeFS;
//export default app;

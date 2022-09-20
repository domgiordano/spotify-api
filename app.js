import express from 'express';
import path from 'path';
import fs from 'fs';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import debug from 'debug';
import bearerToken from 'express-bearer-token';
import dotenv from 'dotenv';
import * as url from 'url';
dotenv.config();
var access_token = "";
var refresh_token = "";
export const fileReader = fs;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// Loggers used. Environment variables used to limit output
const debugAutoWire = debug('auto-wire');
const debugAutoWireWarning = debug('auto-wire-warning');

const app = express();

//app.use(require('morgan')('dev'));
//require('./data/DataStore');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bearerToken());
app.use(cookieParser());
app.use(cors());

// Configure the port to listen on
const PORT = process.env.PORT || 8080;
import AuthRoutes from './routes/authRoutes.js';

app.use('/api', express.static(path.join(__dirname, 'js')));
app.use('/api', express.static(path.join(__dirname, 'html')));
app.use('/api', express.static(path.join(__dirname, '..', 'routes')));
app.use('/api', express.static(__dirname));
app.use('/api', cors(), AuthRoutes);


app.set('access_token', access_token);
app.set('refresh_token', refresh_token);


// Call the listen() method on the server object
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


//export default app;

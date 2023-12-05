const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const debug = require('debug');
const bearerToken = require('express-bearer-token');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bearerToken());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 8080;
const AuthRoutes = require('./routes/authRoutes.js');

app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/api', express.static(path.join(__dirname, 'html')));
app.use('/api', express.static(__dirname));
app.use('/api', cors(), AuthRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

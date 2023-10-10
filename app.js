const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

ENV = process.env.ENVIRONMENT || 'production';
PORT = 8080;

const app = express();
app.use(cors());

// Copy enviroment file to dist
fs.copyFile(
    path.join(__dirname, 'setup', `env.${ENV.toLowerCase()}.js`),
    path.join(__dirname, 'dist/env.js'),
    err => {
        if (err) throw err;
        console.log('[' + ENV + '] environment loaded...');
    });

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server has started in port:${PORT}`);
});

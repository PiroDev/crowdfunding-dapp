var express = require('express');
var app = express();

const PORT = '9000';

app.use(express.static(__dirname));
app.listen(PORT);

console.log('Running at\nhttp://localhost:' + PORT);
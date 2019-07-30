var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use('/', indexRoute);

var listUser = [];
var port = 3000;

server.listen(process.env.PORT || port, function() {
    console.log('Server listening..., port: ' + port);
});
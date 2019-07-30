import express from 'express';

let app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));


let port = 3000;
app.get('/', function(req, res, next) {
  res.send('Chung Pham');
    
});

app.listen(process.env.PORT || port, function() {
  console.log('Server listening..., port: ' + port);
});
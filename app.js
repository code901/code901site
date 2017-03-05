var port = process.env.PORT || 9010;

var views_path = __dirname + '/src/views/';
var views_engine = 'pug';
var landing_view = 'home';
// var css_path = __dirname + '/src/styles/css/';
var css_request_base = '/css';
var less_path = __dirname + '/src/styles/less/';


var express = require('express');
var expressLess = require('express-less');
var compression = require('compression');

var app = express();
app.use(compression());

app.use('/css', expressLess(less_path,
  {
    debug:    app.get('env') == 'development',
    cache:    app.get('env') == 'production',
    compress: app.get('env') == 'production'
  }  
));

app.set('views', views_path);
app.set('view engine', views_engine);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render(landing_view, {
    title: 'Code901'
  });
});

app.listen(port);

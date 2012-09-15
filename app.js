var express     = require('express')
//  , routes      = require('./route')
  , consolidate = require('consolidate')
;

var app         = express();


app.engine('dust', consolidate.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/view');

app.use(express.static(__dirname + '/public', {
    redirect: false
}));
app.use(express.bodyParser());
    
    
app.get('/', function(req, res){
    res.render('index', {
        title: 'Testing out dust.js server-side rendering'
    });
});

app.listen(process.env.PORT);
console.log('listening on port 3000');
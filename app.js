var express     = require('express')
  , consolidate = require('consolidate')
;

var app = express();
var api = require('./api');

app.engine('dust', consolidate.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/view');

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());    
    
app.get('/:page', function(req, res) {
    if (api.hasOwnProperty(req.params.page)) {
        res.format({
            json: function() {
                res.json(api[req.params.page]).get();            
            },
            
            html: function() {
                res.render(req.params.page, api[req.params.page].get());
            }        
        });
    } else {
        res.send('error');
    }
});

app.get('/', function(req, res) {
    res.render('layout');
});

app.listen(process.env.PORT);
console.log('started');
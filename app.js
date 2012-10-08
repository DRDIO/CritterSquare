var express     = require('express')
  , consolidate = require('consolidate')
  , watch       = require('watch')
  , fs          = require('fs')
  , dust        = require('dustjs-linkedin')
;

var app = express();
var api = require('./api');

app.engine('dust', consolidate.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/view');

app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());    
    
app.get('/:page', function(req, res) {
    if (api.hasOwnProperty(req.params.page)) {
        res.format({
            json: function() {
                res.header('Vary', 'Accept-Encoding');
                res.header("Expires", 0); 
    
                res.json(api[req.params.page].get());            
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

function compileDust(path, cur, prev) {
    console.log(path);
    
    fs.readFile(path, function(err, data) {
        if (err) throw err;

        var filename = path.split("/").reverse()[0].replace(".dust", "");
        var filepath = './public/js/dust/' + filename + ".js";
        var compiled = dust.compile(new String(data), filename);

        fs.writeFile(filepath, compiled, function(err) {
            if (err) throw err;
            console.log('Saved ' + filepath);
        });
    });
}

fs.readdir('./view', function(err, files) {
    if (err) throw err;
    
    files.forEach(function(file) {
        compileDust('./view/' + file);
    });
});

watch.createMonitor('./view', function(monitor) {
    monitor.files['*.dust', '*/*'];
    monitor.on("created", compileDust);
    monitor.on("changed", compileDust);    
});

app.listen(process.env.PORT);
console.log('started');
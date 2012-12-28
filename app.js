var express     = require('express')
  , consolidate = require('consolidate')
  , watch       = require('watch')
  , fs          = require('fs')
  , dust        = require('dustjs-linkedin')
  , categories  = require('./categories')
  , requiredir  = require('require-dir')
  , config      = require('./config/default')
  , util        = require('./util')
  , fsq         = require('./foursquare')
;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Setup basic variables
var app = express()
  , api = requiredir('./api')
;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Setup view engine for DUST.js
app.engine('dust', consolidate.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/view');

// Setup server uses
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());    
    
// Setup Cookies and Sessions
app.use(express.cookieParser());
app.use(express.session({ 
    secret: 'poptart'
}));

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Main Page
app.get('/', function(req, res) {
    res.render('layout');
});

// FourSquare Login
app.get('/login', function(req, res) {
    res.writeHead(303, { 
        'location': fsq.getAuthClientRedirectUrl() 
    });
    res.end();
});

// FourSquare Callback
app.get('/callback', function(req, res) {
    fsq.getAccessToken({
        code: req.query.code
    }, function (error, token) {
        if (error) {
            res.send("An error was thrown: " + error.message);
        } else {
            fsq.setToken(token);
            req.session.token = token;
            
            res.writeHead(303, {
                'location': '/'
            });
            res.end();
        }
    });
});

app.get('/push', function(req, res) {
    res.writeHead(303, { 
        'location': fsq.getAuthClientRedirectUrl() 
    });
    res.end();
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

app.get('/:page', function(req, res) {
    console.log(req.params.page);
    console.log(req.session);
    
    if (api.hasOwnProperty(req.params.page)) {
        res.utilrender = util.render;
        api[req.params.page].get(req, res);
    } else {
        res.send('error');
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

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

categories.update();

watch.createMonitor('./view', function(monitor) {
    monitor.files['*.dust', '*/*'];
    monitor.on("created", compileDust);
    monitor.on("changed", compileDust);    
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

app.listen(config.port);

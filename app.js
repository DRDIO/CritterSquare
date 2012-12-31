// Top Level Catch All
process.on('uncaughtException', function(err) {
  console.log(err);
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Initialize modules
var express     = require('express')
  , http        = require('http')
  , consolidate = require('consolidate')
  , fs          = require('fs')
  , dust        = require('dustjs-linkedin')
  , requiredir  = require('require-dir')
  
  // Services
  , util        = require('./util')
  , config      = require('./config/default')
  , foursquare  = require('./foursquare')
  , socket      = require('./socket')
  , database    = require('./database')
;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Setup basic variables and init modules
var app     = express()
  , server  = http.createServer(app)
  , io      = socket.init(server, config.socketio)
  , fsq     = foursquare.init(config.foursquare)
  , dbc     = database.init(config.mongodb)
  , api     = requiredir('./api')
;

// Methods dependent on Service initializations for runtime
var categories  = require('./categories')
  , sync        = require('./sync')
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
    if (req.session.token) {
        sync.pull(req.session.token, function(err, data) {
            console.log('synced with 4sq');
        });
    }
    
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
            req.session.token = token;
            
            res.writeHead(303, {
                'location': '/'
            });
            res.end();
        }
    });
});

// FourSquare HTTPS Push (not used yet)
app.get('/push', function(req, res) {
    res.writeHead(303, { 
        'location': fsq.getAuthClientRedirectUrl() 
    });
    res.end();
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Manage dynamic API requests into /api folder
app.get('/:page', function(req, res) {
    if (api.hasOwnProperty(req.params.page)) {
        res.utilrender = util.render;
        api[req.params.page].get(req, res);
    } else {
        res.send('error');
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Manage IO Socket Connections
io.sockets.on('connection', function(socket) {
    // Nothing to do at this time
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Read through view directory and compile on runtime
fs.readdir('./view', function(err, files) {
    if (err) throw err;
    
    files.forEach(function(file) {
        var path = './view/' + file;
        
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
    });
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Pull FourSquare Category information and cache to use with all users
categories.update();

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Start Server
server.listen(config.port);


/**
 * Module dependencies.
 */
var TwitterNode = require('twitter-node').TwitterNode;
var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/stream',function(req,res){
  res.header('Content-Type','text/event-stream');

  var twit = new TwitterNode({
    user: req.query.username, 
    password: req.query.password,
    track: req.query.track.split(',')
  });
  
  twit.addListener('tweet', function(tweet) {
    var data = {
      user:tweet.user.screen_name,
      tweet:tweet.text
    };
    res.write("event: tweet\n");
    res.write("data:"+JSON.stringify(data)+"\n\n");
  }).stream();

  req.on('close',function(){
    console.log('req close');
    console.log(twit._clientResponse.socket.end());
  })
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

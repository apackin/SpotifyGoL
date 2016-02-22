var express = require('express'),
    app = express(),
    path = require('path');

// app.use(express.static(__dirname, '../browser')));
app.use(express.static('./browser'));
// app.use(express.static(__dirname, '../public')));
app.use(express.static('./public'));

app.get('/', function(req, res){
    res.sendfile(path.join(__dirname, '../browser/index.html'));
});

app.listen(1337, function(){
    console.log("server is listening on port 1337");
});
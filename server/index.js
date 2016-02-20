var express = require('express'),
    app = express(),
    path = require('path');

app.get('/', function(req, res){
    res.sendfile(path.join(__dirname, '../browser/index.html'));
});

app.listen(1337, function(){
    console.log("server is listening on port 1337");
});
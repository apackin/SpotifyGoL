var express = require('express'),
    app = express(),
    path = require('path');


app.set('port', (process.env.PORT || 1337));

// app.use(express.static(__dirname, '../browser')));
app.use(express.static('./browser'));
// app.use(express.static(__dirname, '../public')));
app.use(express.static('./public'));

app.get('/', function(req, res){
    res.sendfile(path.join(__dirname, '../browser/index.html'));
});

app.listen(app.get('port'), function(){
    console.log("server is listening on port", app.get('port'));
});
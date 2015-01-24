var express = require('express'),
    app     = express(),
    bodyParser = require("body-parser");
    http = require('http'),
    fs = require('fs'),
    Download = require('download'),    
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('download.db');


var io = require('socket.io').listen(4876);

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='file'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "file" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"fileName" VARCHAR(255), ' +
           'fileUrl VARCHAR(255))', function(err) {
      if(err !== null) {
        console.log(err);
      }
      else {
        console.log("SQL Table 'file' initialized.");
      }
    });
  }
  else {
    console.log("SQL Table 'file' already initialized.");
  }
});




app.get('/file/', function(req, res) {

  db.all('SELECT * FROM file', function(err, row) {
    if(err !== null) {
      res.send(500, "An error has occurred -- " + err);
    }
    else {
      console.log(row);

        res.send({
            result: row
        });
    }
  });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));


io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socket.emit('bonjour', { hello: 'Bonjour' });
});


app.post('/download/',function(request,response){
    var url = request.body.url;
    
    url =  url.split("'")[1];
    console.log(url);
    io.sockets.emit('bonjour', { hello: 'Download start' });

    var download = new Download({ extract: true, strip: 1, mode: '755' })
        .get(url)
        .dest('download').use(test());
        

    download.run(function (err, files, stream) {
        if (err) {
            result = err;
        }

        result = 'File downloaded successfully!';

        response.send({
            result: result
        });
    });

    var sqlRequest = "INSERT INTO file (fileName, fileUrl) VALUES('test', '"+url+"')";
  db.run(sqlRequest, function(err) {
    if(err !== null) {
      
    }
    else {
      console.log("error");
    }});

});


var test = function (opts) {
    return function (res, url, cb) {
        io.sockets.emit('download', { total: parseInt(res.headers['content-length'], 10)});
        var count = 0;

        if (res.headers['content-length']) {
        
            res.on('data', function (data) {
                count += data.length;

                io.sockets.emit('download', { count: count });

            });

            res.on('end', function () {
                cb();
            });
        }
    };
}.bind();



app.listen(3454);
console.log('localhost:3454');


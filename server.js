var express = require('express'),
    app     = express(),
    bodyParser = require("body-parser");
    http = require('http'),
    fs = require('fs'),
    Download = require('download'),    
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('download.db');

var _ = require('lodash');
var io = require('socket.io').listen(4876);

var maxId = 0;


db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='file' ",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "file" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"fileName" VARCHAR(255), ' +
           '"fileUrl" VARCHAR(255), '+ ' "status" VARCHAR(10)' +' )' , function(err) {
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
      db.each('SELECT MAX(id) FROM file', function(err, row) {
      if(err !== null) {
        res.send(500, "An error has occurred -- " + err);
      }
      else {
        //console.log(row);
        maxId = row['MAX(id)'];
      }
    });
  }
});



app.get('/file/', function(req, res) {

  db.all('SELECT * FROM file ORDER BY id DESC', function(err, row) {
    if(err !== null) {
      res.send(500, "An error has occurred -- " + err);
    }
    else {
      //console.log(row);

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
    maxId  = maxId + 1;
    url =  url.split("'")[1];
    console.log(url);
    io.sockets.emit('bonjour', { hello: 'Download start' });

    var download = new Download({ extract: true, strip: 1, mode: '774' })
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

    var sqlRequest = "INSERT INTO file (fileName, fileUrl , status) VALUES('"+url.split("/")[(url.split("/").length - 1)]+"', '"+url+"' , 'done')";
    var te = db.run(sqlRequest, function(err) {
      console.log(err )
    if(err != null) {
       console.log(err);
    }
    else {
    }});

});


var test = function (opts) {
    return function (res, url, cb) {
        var idFile = maxId;

        var totalSize = parseInt(res.headers['content-length'], 10);
        var count = 0;

        if (res.headers['content-length']) {
        
            res.on('data', function (data) {
                count += data.length;

                io.sockets.emit('download', { id : idFile , count: count , total : totalSize});

            });

            res.on('end', function () {
                cb();
            });
        }
    };
}.bind();



app.listen(3454);
console.log('localhost:3454');



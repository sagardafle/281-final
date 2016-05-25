//Lets require/import the HTTP module
var http = require('http'),
express = require('express');

//set port
var app = express();
app.set('port', process.env.PORT || 8080);

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
//var url = 'mongodb://ec2-54-82-240-2.compute-1.amazonaws.com:27017,ec2-54-174-128-21.compute-1.amazonaws.com:27017,ec2-54-172-180-67.compute-1.amazonaws.com:27017/test?w=0&readPreference=secondary';

var url = 'mongodb://ec2-54-82-240-2.compute-1.amazonaws.com:27017/test?w=0&readPreference=secondary';

//We need a function which handles requests and send response
app.get('/', function (req, res) {
    // Use connect method to connect to the mongo
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send(400,'Unable to connect to the mongoDB server. Error:', err);
      } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // Get the documents collection
      var collection = db.collection('helloworld');

      // Insert some users
      collection.find().toArray( function(err, result) {
      if (err) {
        console.log('MongoDB error. Error:', err);
        res.send(404,'MongoDB error. Error:', err);
      } else if (result.length) {
        console.log('Found:', result);
		  result[0]['url'] = url;
        res.send(200,result);
		
      } else {
        console.log('No document(s) found with defined "find" criteria!');
        res.send(404,'No document(s) found with defined "find" criteria!');
      }
      //Close connection
      db.close();
    });
  }
});
    //response.end('It Works!! Path Hit: ' + request.url);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
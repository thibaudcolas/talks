var express = require('express');
var rest = require('restler');
var mongoose = require ('mongoose');

var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/lm';

mongoose.connect(uristring);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Succeeded connected to: ' + uristring);
  mongoose.connection.db.collectionNames(function (err, names) {
    console.log(names);
  });
  Station.find({}).count(function (err, result) {
    console.log(result + ' stations in collection');
  });
});

/**
 * Reproduces the data model from the SOAP WS w/ additional information.
 */
var stationSchema = mongoose.Schema({
    ID: String,
    Name: String,
    City: String,
    CB: Boolean,
    SlotsTotal : Number,
    BikesAvailable: Number,
    Lat: Number,
    Lng: Number,
    SlotsAvailable: Number,
    Updated: {
      type: Date,
      default: Date.now
    },
    Geo: {
      type: [Number],
      index: '2d'
    }
});

var Station = mongoose.model('Station', stationSchema);

/*
LAT/LNG
43.61092/3.87723
**/
/**
    Vélos au départ
    Idem à l'arrivée

    Stations selon coord + perim
    Dispos des places et vélos


    Station la plus proche qui a des places
    Station la plus proche qui a des vélos
 */

var app = express();

var conf = {
  maxResults: 3
};

var retrieveAllStations = function (callback) {
  rest.get('http://192.168.1.148/Bikes/Stations', {parser: rest.parsers.json}).on('complete', callback);
};

var stationMapping = function (raw) {
  return new Station({
    ID: raw.ID,
    Name: raw.Name,
    City: raw.City,
    CB: raw.CB === 1,
    SlotsTotal : raw.SlotsTotal,
    BikesAvailable: raw.BikesAvailable,
    SlotsAvailable: raw.SlotsAvailable,
    Lat: parseFloat(raw.Lat),
    Lng: parseFloat(raw.Lng),
    Geo: [
      parseFloat(raw.Lng),
      parseFloat(raw.Lat)
    ]
  });
};

app.get('/bikes/:lat/:lon/:threshold', function (req, resp) {
  var loc = [parseFloat(req.params.lon), parseFloat(req.params.lat)];
  Station.find({
    Geo: {
      $near: loc
    },
    BikesAvailable: {
      $gte: req.params.threshold
    }
  }).limit(conf.maxResults).exec(function (error, stations) {
    console.log(stations[0]);
    resp.send(stations);
  });
});

app.get('/slots/:lat/:lon/:threshold', function (req, resp) {
  var loc = [parseFloat(req.params.lon), parseFloat(req.params.lat)];
  Station.find({
    Geo: {
      $near: loc
    },
    SlotsAvailable: {
      $gte: req.params.threshold
    }
  }).limit(conf.maxResults).exec(function (error, stations) {
    console.log(stations[0]);
    resp.send(stations);
  });
});

app.get('/stations/:lat/:lon/:threshold', function (req, resp) {
  var loc = [parseFloat(req.params.lon), parseFloat(req.params.lat)];
  Station.find({
    Geo: {
      $near: loc
    },
    BikesAvailable: {
      $gte: req.params.threshold
    },
    SlotsAvailable: {
      $gte: req.params.threshold
    }
  }).limit(conf.maxResults).exec(function (error, stations) {
    console.log(stations[0]);
    resp.send(stations);
  });
});

app.get('/update', function (req, resp) {

  Station.remove({}, function(err) {
    if (err) {
      console.log('Error removing old data');
    }
  });

  retrieveAllStations(function (stations) {
    var s;
    stations.forEach(function (e, i, array) {
      s = stationMapping(e);
      s.save(function (err, s) {
        if (err) {
          console.log(err);
        }
      });
    });
  });

  resp.send('Update started');
});

var port = process.env.PORT || 9000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


var express = require('express');
var rest = require('restler');
var soap = require('soap');
var parser = require('xml2json');

var app = express();
var wsdl = 'http://193.239.192.237:8040/services/getStops?wsdl';

var args = {
  Mode : 'Geo',
  Key: 'kGjGDgCWCUijXyExmQVvQ',
  API: '1',
  Mode: 'Geo',
  Lat: '43.606029',
  Lng: '3.876907',
  Perimeter: '100'
};

app.get('/stops/:lat/:lon/:per', function (req, resp) {
  args.Lat = req.params.lat;
  args.Lng = req.params.lon;
  args.Perimeter = req.params.per;
  soap.createClient(wsdl, function(err, client) {
    client.getStops.getStops.getStops(args, function(err, result) {
      resp.send(JSON.parse(parser.toJson(result.body))['soap:Envelope']['soap:Body']['tns:getStopsResponse']['Stop']);
    });
  }, 'http://193.239.192.237:8040/services/getStops');
});

var port = process.env.PORT || 9000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


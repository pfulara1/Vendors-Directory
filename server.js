var express= require('express');
var app=express();
var path=require('path');
var http= require('http');
//const request = require('request-promise');
var fs= require('fs');
var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//connect to mongo db database
mongoose.connect('mongodb://admin:admin@ds127132.mlab.com:27132/vendor');

app.use(express.static(__dirname+'/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing

//vendor schema
var vendorSchema= new Schema({
  name:String,
  image: { data: Buffer, contentType: String },
  vendortype:String,
  location: {
   type: [Number],  // [<longitude>, <latitude>]
   index: '2d'      // create the geospatial index
  },
  contactinfo:String,
  email:String,
  description:String
});
//creating a  model for mongoDB database
var Vendor= mongoose.model('Vendor',vendorSchema);

app.get('/',function(req,resp){
resp.sendFile(__dirname+'views/index.html');
});

app.post('/', function(req,resp){
  var vendor_type=req.body._vendortype;
  var max_distance=req.body._vendordistance;
  var location=req.body._location.split(':');

  var query = Vendor.find({'location': {
  $near: [
    location[0],
    location[1]
  ],
  $maxDistance: max_distance
},
  'vendortype':vendor_type
});

query.exec(function (err, vendor) {
  if (err) {
    console.log(err);
    throw err;
  }

  if (!vendor) {
    vendor={};
      resp.send(vendor);

  } else {
     resp.send(vendor);
 }
});

});


app.listen(3000,'127.0.0.1');
console.log('server active');

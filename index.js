var express = require('express');
var pug = require('pug');
var mysql = require('mysql');
var multer  = require('multer');
var shortid = require('shortid');
var bodyParser = require('body-parser');
var config = require('./config.js');

var jsonParser = bodyParser.json();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + '-' + Date.now() + "." + file.originalname.split(".")[1]);
  }
})

var upload = multer({ storage: storage });

var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : config.mysqluser,
  password : config.mysqlpassword,
  socketPath: '/tmp/mysql.sock',
  database : config.mysqldb,
});

app.set('view engine', 'pug');
app.use(express.static('public'));

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.get('/', function (req, res) {
  res.render('index');
});

// app.post('/upload-single', upload.single('asset'), function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
//   console.log(req.file);
//   console.log(req.body);
// })

app.post('/upload-files-2', upload.any(), function (req, res, next) {
  console.log(req.files);
  console.log(req.body);
  res.send({files: req.files});
});

app.post('/upload-files', upload.any(), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any

  var assetId = shortid.generate();
  var thumbnailText = req.body['thumbnail'];
  var assetName = req.body['title'];
  var assetCategory = req.body['category'];
  var assetTags = JSON.parse(req.body['tags']);
  var assetTagsString;
  //console.log(assetTags);
  for(var i=0; i<assetTags.length; i++){
    if(i === assetTags.length - 1) {
      console.log(assetTags[i]);
      assetTagsString += assetTags[i];
    } else {
      assetTagsString += assetTags[i] + ", ";
    }
  }
  //console.log(assetTagsString);
  var assetTagsString;
  var assetContext = req.body['context'];
  var assetDefinition = req.body['definition'];
  var assetDescription = req.body['asset-description'];
  var assetPath;
  var attachementPaths = [];
  var previewUri = "";
  for(var i = 0; i<req.files.length; i++) {
    if(req.files[i]['fieldname'] === 'asset-upload'){
      assetPath = req.files[i]['path'];
    }
    if(req.files[i]['fieldname'] === 'attachment'){
      attachementPaths.push(req.files[i]['path']);
    }
    if(req.files[i]['fieldname'] === 'preview-image'){
      previewUri = req.files[i]['path'];
    }
  }

  var assetTagArray = assetTags;

  var assetQuery = "INSERT INTO asset (name, tags, category, context, description, definition, asset_uri, preview_uri, version, upload_date, download_count, view_count, approval, asset_id) VALUES (" +
    "\"" + assetName + "\", " +
    "\"" + assetTags + "\", " +
    "\"" + assetCategory + "\", " +
    "\"" + assetContext + "\", " +
    "\"" + assetDescription + "\", " +
    "\"" + assetDefinition + "\", " +
    "\"" + assetPath + "\", " +
    "\"" + previewUri + "\", " +
    "1" + ", " +
    "SYSDATE()" + ", " +
    "0" + ", " +
    "0" + ", " +
    "0" + ", " +
    "\"" + assetId + "\");";

  var attachmentQuery = "INSERT INTO attachements (asset_id, attachment_id, upload_date, download_count) VALUES (" +
    "\"" + assetId+ "\", " +
    "\"" + shortid.generate() + "\", " +
    "SYSDATE(), " +
    "0)";

  var tagAddingCounter = 0;

  connection.query(assetQuery, function(err, rows, fields){
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    if(rows){
      console.log(rows);

      for(var i=0; i<assetTagArray.length; i++) {
        connection.query("INSERT INTO tags (name) VALUE (\"" + assetTagArray[i] + "\") ON DUPLICATE KEY UPDATE name=\"" + assetTagArray[i] + "\";", function(err, rows, fields){
          if(err) {
            console.log(err);
          }
          if(rows) {
            tagAddingCounter++;
            if(tagAddingCounter === (assetTagArray.length - 1)){
              console.log("sending status");
              res.sendStatus(200);
            }
          }
        });
      }
    }
  });

  // console.log(query);

});

app.post('/multiple-upload-files', upload.any(), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any

  var assetId = req.body['assetid']
  var assetName = req.body['title'];
  var assetCategory = req.body['category'];
  var assetTags = JSON.parse(req.body['tags']);
  var assetTagsString = "";
  //console.log(assetTags);
  for(var i=0; i<assetTags.length; i++){
    if(i === assetTags.length - 1) {
      //console.log(assetTags[i]);
      assetTagsString += assetTags[i];
    } else {
      assetTagsString += assetTags[i] + ", ";
    }
  }
  console.log(assetTagsString);
  var assetTagsString;
  var thumbnailText = req.body['thumbnail']
  var assetContext = req.body['context'];
  var assetDefinition = req.body['definition'];
  var assetDescription = req.body['asset-description'];
  var assetPath = req.body['assetpath'];
  var attachementPaths = [];
  var previewUri = "";
  for(var i = 0; i<req.files.length; i++) {
    if(req.files[i]['fieldname'] === 'attachment'){
      attachementPaths.push(req.files[i]['path']);
    }
    if(req.files[i]['fieldname'] === 'preview-image'){
      previewUri = req.files[i]['path'];
    }
  }

  var assetTagArray = assetTags;

  var assetQuery = "INSERT INTO asset (name, tags, category, context, description, definition, asset_uri, preview_uri, version, upload_date, download_count, view_count, approval, asset_id, thumbnail) VALUES (" +
    "\"" + assetName + "\", " +
    "\"" + assetTags + "\", " +
    "\"" + assetCategory + "\", " +
    "\"" + assetContext + "\", " +
    "\"" + assetDescription + "\", " +
    "\"" + assetDefinition + "\", " +
    "\"" + assetPath + "\", " +
    "\"" + previewUri + "\", " +
    "1" + ", " +
    "SYSDATE()" + ", " +
    "0" + ", " +
    "0" + ", " +
    "0" + ", " +
    "\"" + assetId + "\", " + 
    "\"" + thumbnailText + "\");";

  var attachmentQuery = "INSERT INTO attachements (asset_id, attachment_id, upload_date, download_count) VALUES (" +
    "\"" + assetId+ "\", " +
    "\"" + shortid.generate() + "\", " +
    "SYSDATE(), " +
    "0)";

  var tagAddingCounter = 0;

  connection.query(assetQuery, function(err, rows, fields){
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    if(rows){
      //console.log(rows);

      for(var i=0; i<assetTagArray.length; i++) {
        connection.query("INSERT IGNORE INTO tags (name) VALUE (\"" + assetTagArray[i] + "\");", function(err, rows, fields){
          if(err) {
            console.log(err);
          }
          if(rows) {
            tagAddingCounter++;
            if(tagAddingCounter === (assetTagArray.length - 1)){
              console.log("finished with tags");
            }
          }
        });
      }
      console.log("adding asset");
      res.send({id: assetId});

    }
  });

  // console.log(query);

});

app.get('/list', function(req,res){
  var assets = [];
  connection.query("SELECT * FROM asset;", function(err, rows, fields) {
    if(err) {
      console.log(err);
      res.render('list');
    }
    if(rows){
      for(var i=0; i<rows.length; i++){
        assets.push(rows[i]);
      }
      res.render('list', {assets: assets.reverse()});
    }
  });
});

app.post('/delete-asset', jsonParser, function(req, res){
  // console.log(req.body);
  var assetId = req.body.id;
  connection.query("DELETE FROM asset WHERE asset_id=\"" + assetId + "\";", function(err, rows, fields){
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    if(rows){
      console.log("deleted");
      res.sendStatus(200);
    }
  });
});

app.get('/get-tags', function(req,res){
  var tags = [];
  connection.query("SELECT * FROM tags;", function(err, rows, fields){
    if(err) {
      console.log(err);
      res.sendStatus(500);
    }
    if(rows){
      for(var i=0; i<rows.length; i++){
        tags.push(rows[i].name);
      }
      res.send({data: tags});
    }
  });
});

app.get('/upload-multiple', function(req, res){
  res.render('upload-multiple');
})

app.get('/ajax-search', function(req,res) {
  var searchTerm = req.query.search;
  function titleQuery(searchTerm){
    var data=[];
    var titlequery = 'SELECT * FROM asset WHERE name like "%'+searchTerm+'%";';
    console.log(titlequery);
    connection.query(titlequery, function(err, rows, fields) {
      if (err) throw err;
      for(i=0;i<rows.length;i++)
      {
        var assetObj = {};
        assetObj.id = rows[i].asset_id;
        assetObj.name = rows[i].name;
        assetObj.thumbnail = rows[i].thumbnail;
        data.push(assetObj);
      }
      res.send(JSON.stringify(data));
    });
  };

  titleQuery(searchTerm);

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


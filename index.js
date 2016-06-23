var express = require('express');
var pug = require('pug');
var mysql = require('mysql');
var multer  = require('multer');
var shortid = require('shortid');

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
  user     : 'root',
  password : 'root',
  socketPath: '/tmp/mysql.sock',
  database : 'scar'
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

app.post('/upload-files', upload.any(), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any

  var assetId = shortid.generate();
  var assetName = req.body['title'];
  var assetCategory = req.body['category'];
  var assetTags = req.body['tags'];
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
    "NOW()" + ", " +
    "0" + ", " +
    "0" + ", " +
    "0" + ", " +
    "\"" + assetId + "\");";

  var attachmentQuery = "INSERT INTO attachements (asset_id, attachment_id, upload_date, download_count) VALUES (" +
    "\"" + assetId+ "\", " +
    "\"" + shortid.generate() + "\", " +
    "NOW(), " +
    "0)";

  connection.query(assetQuery, function(err, rows, fields){
    if(err) {
      console.log(err);
      res.send(500);
    }
    if(rows){
      console.log("success!");
      console.log(rows);
      res.send(200);
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
      console.log("success!");
      for(var i=0; i<rows.length; i++){
        assets.push(rows[i]);
      }
      console.log("assets:" + assets);
      res.render('list', {assets: assets});
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


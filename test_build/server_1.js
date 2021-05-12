var path = require("path");
var express = require("express");
var fs = require("fs");
var bodyParser = require('body-parser')
var app = express();
var http = require("http");

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    // in test/production server, delete 'https://shgsec-csp-frontend-test.aigauss.com' source, 'self' is enough
    // "Content-Security-Policy": "default-src 'none'; child-src 'none'; object-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; img-src 'self' data: https://shgsec-csp.oss-cn-shanghai.aliyuncs.com; connect-src 'self' https://shgsec-csp-frontend-test.aigauss.com https://shgsec-csp-frontend.aigauss.com",
    // "X-Content-Security-Policy": "default-src *; style-src * 'unsafe-inline' localhost:*/*; script-src 'self' localhost:*/*",
    // "X-WebKit-CSP": "default-src *"
    // "Content-Security-Policy": "default-src 'none'; child-src 'none'; object-src 'none'; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; img-src 'self' data: https://shgsec-csp.oss-cn-shanghai.aliyuncs.com; connect-src 'self'",
  })
  next();
});

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies

//https://blog.cloudboost.io/run-your-angular-app-on-nodejs-c89f1e99ddd3
app.get('*', function (req, res, next) {
  var pathName = req._parsedUrl.pathname || "";
  var root = "../dist/";
  var filename = path.join(root, pathName);
  var errHandler = function (err) {
    if (err) {
      res.status(404).send('not found!');
    }
  }
  // console.log('pathName', pathName)
  // console.log('language', language)
  // console.log('filename',filename)
  if (/\.[a-z]+$/.test(filename)) {
    res.sendFile(path.resolve(filename), {}, errHandler);
  } else {
    res.sendFile(path.resolve(root + 'index.html'), {}, errHandler);
  }
});
var port = 8011;
http.createServer(app).listen(port);
console.log("Listening at http://localhost:" + port);

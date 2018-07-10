var express = require('express');
var app = express();
 
app.use(express.static('./dist'))

var server = app.listen(3500, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("服务启动成功 http://%s:%s", host, port)
 
})
var fs = require('fs');
var path = require('path');

let privateKey  = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
let certificate = fs.readFileSync(path.join(__dirname, './certificate/csr.crt'), 'utf8');
let cert = {key: privateKey, cert: certificate};

var app = require('https').createServer(cert,handler)
var io = require('socket.io')(app);

app.listen(8088);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
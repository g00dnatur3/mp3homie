const request = require('request')
const fs = require('fs')
var tr = require('tor-request')

tr.request({
  url: 'https://www.google.com.np/images/srpr/logo11w.png',
  // strictSSL: true,
  // agentClass: require('socks5-https-client/lib/Agent'),
  // agentOptions: {
  //   socksHost: 'localhost', // Defaults to 'localhost'.
  //   socksPort: 9050, // Defaults to 1080.
  // }
 }, function(err, res) {
  //console.log(err || res.body);
 }).pipe(fs.createWriteStream('doodle.png'))
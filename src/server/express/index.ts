process.title = 'MP3GEM_WEBSITE'

import bodyParser from 'body-parser';
import {NextFunction, Request, Response} from 'express';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
//import favicon from 'serve-favicon'
import fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import morgan from 'morgan';
import path from 'path';
import getLog from '../../utils/log';
import HttpError from './HttpError';
import errorHanlder from './middleware/errorHandler';
import assert from 'assert'
// import {putWebSocket} from './middleware/websockets'
// import ws from 'ws';

// -- IMPORT CONTROLLERS HERE --
import Controller from './controllers/Controller';

const log = getLog(__filename);
const app: express.Application = express();
const env: string = app.get('env');

// function ensureSecure(req, res, next){
//   if (req.secure) {
//     // OK, continue
//     return next();
//   };
//   // handle port numbers if you need non defaults
//   // res.redirect('https://' + req.host + req.url); // express 3.x
//   res.redirect('https://' + req.hostname + req.url); // express 4.x
// }
// if (env === 'production') {
//   app.all('*', ensureSecure);
// }

app.use(morgan('dev')); // logging middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(favicon(path.join(__dirname, '../../../../public', 'favicon.ico')))
app.use(express.static('public'));

function routeToIndex(req: any, res: any) {
  const index: string = '../../../public/index.html';
  res.sendFile(path.join(__dirname, index), (err: any) => {
    if (err) { res.status(500).send(err); }
  });
}

// #######################################
// #    CLIENT ROUTES  -->  REACT ROUTER
// #######################################
// Add forwarding to the clientside REACT-ROUTER --> src/client/app.tsx
if (env === 'production' || env === 'staging') {
  // If you update src/client/app.tsx, then you MUST update here (production only)
  app.use('/home', routeToIndex);
  app.use('/terms', routeToIndex);
  app.use('/privacy', routeToIndex);
  app.use('/copyright', routeToIndex);
  app.use('/contact', routeToIndex);
}

// #######################################
// #    API ROUTE  -->  CONTROLLER
// #######################################
// Add your controller(s) here
app.use('/api', Controller);

// #######################################
// #    ERROR HANDLING - DO NOT MOVE
// #######################################
// catch 404 and forward to errorHandler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new HttpError('not found');
  err.status = 404;
  next(err);
});
app.use(errorHanlder);

 const sslOpts = {
   key: fs.readFileSync('/etc/letsencrypt/live/mp3gems.com/privkey.pem'),
   cert: fs.readFileSync('/etc/letsencrypt/live/mp3gems.com/fullchain.pem'),
   requestCert: false,
   rejectUnauthorized: false,
 };

let port = 9091; // dev-port

assert(process.env.IP, 'process.env.IP must not be null')
const ip = process.env.IP


 if (env === 'production') {
   // start ssl server
   const server = https.createServer(sslOpts, app).listen(443, ip, function() {
     console.log('Listening on port 443 with SSL')
     console.log(`NODE_ENV: ${env}`)
   })
   port = 80 // prod-port
}

// if (env === 'staging') {
//   port = 8082; // staging-port
// }

//assert(process.env.IP, 'process.env.IP must not be null')
//const ip = process.env.IP
const server = http.createServer(app).listen(port, ip, () => {
  log.info(`Listening on port ${port} using ip ${ip}`);
  log.info(`NODE_ENV: ${env}`);
});

// server.on('connection', function (socket) {  
//   console.log('server.on.connection - setNoDelay'); 
//   socket.setNoDelay(true); 
// });

// Set up a headless websocket server that prints any
// // events that come in.
// const wsServer = new ws.Server({ noServer: true });
// wsServer.on('connection', socket => {

//   const clientId = uuidv4()

//   // console.log('connection event:', socket)

//   socket.send(JSON.stringify({clientId}))
//   putWebSocket(clientId, socket)

//   socket.on('message', message => console.log('message event:', message));
// });

// // `server` is a vanilla Node.js HTTP server, so use
// // the same ws upgrade process described here:
// // https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
// server.on('upgrade', (request, socket, head) => {
//   wsServer.handleUpgrade(request, socket, head, socket => {
//     wsServer.emit('connection', socket, request);
//   });
// });

export default server;

/**
 * Server.js
 */

const config = require('../config.json');
const httpMod = require('http');
const Logger = require(`../${config.srcDir}/scripts/utils/logger.js`);
const logger = new Logger({ label: 'server' });
const session = require('express-session');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = multer();
const sharp = require('sharp');

/**
 *
 * Express
 *
 */

app.use(express.static(config.publicDir, { index: false }));
app.use('/images', express.static('uploads'));
app.use(session({
  secret: '$eCuRiTy',
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.json());

// Had to change index.html name, not sure why
app.get('/', (req, res)=>{
  if (!req.session.items) {
    req.session.items = [];
  }
  res.sendFile('main.html', {
    root: `${ __dirname }/../${ config.publicDir }`,
  });
});

// Set 404 error for everything other than main.html
// Not working, not sure why.
// app.get('*', function(req, res) {
//   res.sendFile('404.html', {
//     root: `${ __dirname }/../${ config.publicDir }`,
//   });
// });

app.get('/items', (req, res)=> {
  res.json(req.session.items);
});

app.post('/item', upload.single('img'), (req, res)=> {
  try {
    sharp(req.file.buffer)
    .resize(320, 320)
    .toFile('uploads/' + req.file.originalname, function(err) {
      if(err) throw err;
    });

    req.session.items.push({
      img: 'images/' + req.file.originalname,
    });
    res.json(req.session.items);
  }
  catch(err) {
    res.json({
      code: 1,
      error: err,
    });
  }

});

app.put('/item', (req, res)=>{
  const origin = req.body.was;
  const target = req.body.now;
  const items = req.session.items.slice(0);
  const item = items[origin];
  items.splice(origin, 1, target);
  // if oldImage != newImage delete oldImage
  req.session.items = items;
  res.json(req.session.items);
});

// TODO: delete image
app.delete('/item', (req, res)=> {
  const items = req.session.items.slice(0);
  items.splice(req.body.index, 1);
  req.session.items = items;
  res.json(req.session.items);
});

const server = httpMod.createServer(app);

server.listen(config.port, config.ip, function listening() {
  logger.info(`\n______________________________________________________\n\n http://${server.address().address}:${server.address().port}...\n______________________________________________________\n`);
  if(typeof process.send !== 'undefined') {
    process.send({ ready: true });
  }
});

// livereload functionality
if(process.env.NODE_ENV === 'development') {
  const ws = require('./ws.js');
  ws.init(server);
}

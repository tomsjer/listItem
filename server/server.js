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
const path = require('path');
// const upload = multer({ dest: 'uploads/' });
const upload = multer();
const sharp = require('sharp');

/**
 *
 * Express
 *
 */
const p = path.join(__dirname, '../public');
app.use(express.static(p));
app.use('/images', express.static(path.join(__dirname,'uploads')));
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
    root: path.join(__dirname,`../${ config.publicDir }`),
  });
});


// Set 404 error for everything other than main.html
// Not working, not sure why.
// app.get('*', function(req, res) {
//   res.sendFile('404.html', {
//     root: `${ __dirname }/../${ config.publicDir }`,
//   });
// });

/**
 *
 * ListItems API
 *
 */

// List items
app.get('/items', (req, res)=> {
  try {
    res.json({
      code: 0,
      items: req.session.items,
    });
  }
  catch(e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

// Add item
app.post('/item', upload.single('img'), (req, res)=> {
  try {
    sharp(req.file.buffer)
    .resize(320, 320)
    .toFile(path.join(__dirname,'uploads/' + req.file.originalname) , function(err) {
      if(err) throw err;

      req.session.items.push({
        img: '/images/' + req.file.originalname,
        txt: req.body.txt,
      });
      res.json({
        code: 0,
        items: req.session.items,
      });
    });
  }
  catch(err) {
    console.log(err)
    res.json({
      code: 1,
      error: err,
    });
  }

});

// EditItem
app.put('/item', upload.single('img'), (req, res)=>{
  try {
    const i = req.body.index;
    const items = req.session.items.slice(0);
    const item = items[i];

    // if oldImage != newImage delete oldImage
    if(req.file && item.img !== 'images/' + req.file.originalname) {

      // TODO: DELETE OLD IMG
      sharp(req.file.buffer)
      .resize(320, 320)
      .toFile('uploads/' + req.file.originalname, function(err) {
        if(err) throw err;

        item.img = 'images/' + req.file.originalname;
        item.txt = req.body.txt;
        items.splice(i, 1, item);

        req.session.items = items;
        res.json({
          code: 0,
          items: req.session.items,
        });
      });

    }
    else {
      item.txt = req.body.txt;
      items.splice(i, 1, item);

      req.session.items = items;
      res.json({
        code: 0,
        items: req.session.items,
      });
    }

  }
  catch(e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

// Reorder
app.put('/items', (req, res)=>{
  try {
    const items = req.session.items.slice(0);
    const item = items[req.body.prevIndex];
    req.body.currIndex = req.body.currIndex === -1 ? items.length - 1 : req.body.currIndex;
    items.splice(req.body.prevIndex, 1);
    items.splice(req.body.currIndex, 0, item);

    req.session.items = items;
    res.json({
      code: 0,
      items: req.session.items,
    });
  }
  catch(e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

// DeleteItem
app.delete('/item', (req, res)=> {
  try {
    const i = req.body.index;
    const items = req.session.items.slice(0);
    const item = items[i];

    // Delete item[i].img from disk
    items.splice(i, 1);

    req.session.items = items;
    res.json({
      code: 0,
      items: req.session.items,
    });
  }
  catch(e) {
    res.json({
      code: 1,
      msg: e,
    });
  }
});

const server = httpMod.createServer(app);

server.listen(config.port, function listening() {
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

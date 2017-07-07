import config from '../../../config.json';
import Model from './Models/Model.js';
import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

function init() {
    
  const appModel = new Model({
    attributes: {
      items: [0,1],
      itemActive: 0,
      views: [],
      loading: true,
      showTooltip: true,
    },
  });

  const appView = new View({
    model: appModel,
    container: document.querySelector('body'),
    events: {},
    template: require('../../templates/App.hbs'),
  });

  const controller = new Controller({
    model: appModel,
    view: appView,
  });

  setTimeout(()=>{
    controller.model.set('items', [0,1,2,3,4]);
  }, 1000);
}

/* development */
if(config.livereload) {

  const wsServer = `ws://${config.ip}:${config.port}`;
  const WsConnection = require('./wsconnection');
  const ws = new WsConnection({
    wsServer: wsServer,
  });
  ws.init()
  .then(()=>{
    init();
  });

}
else {
  init();
}

import config from '../../../config.json';
import App from './app.js';

function init() {
  const app = new App({
    model: {
      attributes: {
        items: [],
        itemsActive: 0,
        views: [],
        loading: true,
        showTooltip: true,
      },
    },
  });
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

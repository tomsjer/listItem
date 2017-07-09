import config from '../../../config.json';
import App from './app.js';
import { bindKeyToState } from '../utils/debugHelpers.js';

function init() {
  const app = new App({
    model: {
      attributes: {
        items: [],
        itemActive: 0,
        itemEdit: false,
        views: [],
        loading: true,
        showTooltip: true,
      },
    },
  });

  if(config.debug) {
    bindKeyToState(app, {
      '49': { // 1
        'loading': true,
        'itemEdit': false,
      },
      '50': { // 2
        'loading': false,
        'itemEdit': false,
        'items': [],
      },
      '51': { // 3
        'loading': false,
        'itemEdit': false,
        'items': [
          { img: 'http://placehold.it/320x320', txt: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' },
          { img: 'http://placehold.it/320x320', txt: 'Recusandae facere tempore qui voluptatibus placeat voluptas consequuntur neque ut necessitatibus vitae' },
          { img: 'http://placehold.it/320x320', txt: 'Perspiciatis eveniet in ipsam sed quae, praesentium nihil. Possimus, qui.' },
          { img: 'http://placehold.it/320x320', txt: 'Consectetur adipisicing elit. Quae at expedita, illo? Beatae aut vitae ullam, veritatis recusandae temporibus dignissimos error quibusdam, voluptates nihil architecto magni ipsam at repellendus soluta.' },
          { img: 'http://placehold.it/320x320', txt: 'Lorem qewipsum' },
          { img: 'http://placehold.it/320x320', txt: 'ITEMMMMMMMMM' },
          { img: 'http://placehold.it/320x320', txt: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' },
          { img: 'http://placehold.it/320x320', txt: 'Recusandae facere tempore qui voluptatibus placeat voluptas consequuntur neque ut necessitatibus vitae' },
          { img: 'http://placehold.it/320x320', txt: 'Perspiciatis eveniet in ipsam sed quae, praesentium nihil. Possimus, qui.' },
          { img: 'http://placehold.it/320x320', txt: 'Consectetur adipisicing elit. Quae at expedita, illo? Beatae aut vitae ullam, veritatis recusandae temporibus dignissimos error quibusdam, voluptates nihil architecto magni ipsam at repellendus soluta.' },
          { img: 'http://placehold.it/320x320', txt: 'Lorem qewipsum' },
          { img: 'http://placehold.it/320x320', txt: 'Lorqwewqem ipsum' },
        ],
      },
      '52': { // 4
        'loading': false,
        'itemEdit': true,
        'items': [
          { img: 'http://placehold.it/320x320', txt: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' },
        ],
      },
    });
  }
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

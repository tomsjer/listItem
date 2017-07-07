import config from '../../../config.json';
import Model from './Models/Model.js';
import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

function init() {
    
  const appModel = new Model({
    attributes: {
      items: [],
      itemsActive: 0,
      views: [],
      loading: true,
      showTooltip: true,
    },
  });

  class AppView extends View {
    constructor(opts) {
      super(opts);
    }
    // Override update to prevent subviews destruction
    update() {
    }
  }

  const appView = new AppView({
    model: appModel,
    container: document.querySelector('body'),
    events: {
    },
    template: require('../../templates/App.hbs')
  });

  class AppController extends Controller {
    constructor(opts) {
      super(opts);

      this.view.render();
      this.input = new Controller({
        model: appModel,
        view: new View({
          container: this.view.container.querySelector('.input'),
          events: {
            'itemActive:input': function(e) {
              this.emit('change', e.target.dataset.bind, e.target.value);
            },
          },
          template: require('../../templates/Input.hbs'),
        }),
      });

      this.counter = new Controller({
        model: appModel,
        view: new View({
          container: this.view.container.querySelector('.counter'),
          events: {
          },
          template: require('../../templates/Counter.hbs'),
        }),
      });

      this.counter2 = new Controller({
        model: appModel,
        view: new View({
          container: this.view.container.querySelector('.counter2'),
          events: {
          },
          template: require('../../templates/Counter.hbs'),
        }),
      });
      this.view.on('beforeRender', this.destroySubViews.bind(this));
      this.view.on('afterRender', this.appendSubViews.bind(this));
      
    }
    destroySubViews() {

      this.input.view.destroy();
      this.counter.view.destroy();
      this.counter2.view.destroy();
    }
    appendSubViews() {

      this.input.view.render();
      this.counter.view.render();
      this.counter2.view.render();
    }

  }

  const controller = new AppController({
    model: appModel,
    view: appView
  });

  setInterval(()=>{
    const items = controller.model.get('items').slice(0);
    items.push(Math.random())
    controller.model.set('items', items);
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

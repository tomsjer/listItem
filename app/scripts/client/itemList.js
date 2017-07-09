import View from './Views/View.js';
import Controller from './Controllers/Controller.js';
import Handlebars from 'hbsfy/runtime';
import dragula from 'dragula';

Handlebars.registerHelper('isActive', function isActive(options) {
  let operation;
  if (options.hash.index === (options.hash.itemActive | 0)) {
    operation = options.fn(this);
  }
  else {
    operation = options.inverse(this);
  }
  return operation;
});

export default class ItemList {
  constructor(model) {
    this.view = new View({
      model: model,
      container: '.item-list',
      events: {
        'item:click': function onClick(e) {
          const index = e.currentTarget.dataset.index;
          // this.emit('change', 'itemActive', index);
          this.model.setBulk({
            'itemActive': index,
            'itemEdit': false,
          });
        },
      },
      template: require('../../templates/ItemList.hbs'),
    });
    this.view.on('afterRender', function setDragula() {
      const self = this;
      const container = document.querySelector('.item-list .wrapper');
      const drake = dragula([container], {
        mirrorContainer: container,
      });
      drake.on('drop', (el, target, source, sibling)=> {
        
        const items = self.model.get('items').slice(0);
        const was = el.dataset.index | 0;
        const now = sibling.classList.contains('gu-mirror') ? items.length - 1 : sibling.dataset.index | 0;

        // Move this to BE
        const item = items[was];
        items.splice(was, 1);
        items.splice(now, 0, item); // FIXME: when dropping below item substr 1?
        self.emit('change', 'items', items);
      });
    });
    this.controller = new Controller({
      model: model,
      view: this.view,
    });
  }
}

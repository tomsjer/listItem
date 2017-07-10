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
  constructor(opts) {
    this.view = new View({
      model: opts.model,
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
        'deleteItem:click': function onClick(e) {
          this.emit('deleteItem', e);
        },
      },
      template: require('../../templates/ItemList.hbs'),
    });

    // Sortable
    this.view.on('afterRender',function setDragula() {

      const self = this;
      const container = document.querySelector('.item-list .wrapper');
      const drake = dragula([container], {
        mirrorContainer: container,
      });
      drake.on('drop', (el, target, source, sibling)=> {

        const prevIndex = el.dataset.index | 0;
        const currIndex = sibling.classList.contains('gu-mirror') ? -1 : sibling.dataset.index | 0;

        this.emit('reorder', prevIndex, currIndex);
      });
    });

    this.controller = new Controller({
      model: opts.model,
      view: this.view,
      events: opts.events
    });
  }
}

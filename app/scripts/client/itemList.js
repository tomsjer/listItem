import View from './Views/View.js';
import Controller from './Controllers/Controller.js';
import imagesLoaded from '../utils/imagesLoaded.js';
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
        'startEdit:click': function startEdit(e) {
          this.emit('startEdit', e);
          e.cancelBubble = true;
        },
      },
      template: require('../../templates/ItemList.hbs'),
    });

    this.view.on('afterRender', function loadImages() {
      const container = document.querySelector(this.container);
      container.querySelectorAll('img[data-src]').forEach(el => imagesLoaded(el) );
    });
    // Sortable
    this.view.on('afterRender', function setDragula() {

      const self = this;
      const container = document.querySelector('.item-list .wrapper');
      const drake = dragula([container], {
        mirrorContainer: container,
      });
      drake.on('drop', (el, target, source, sibling)=> {

        const prevIndex = el.dataset.index | 0;
        let currIndex = prevIndex;
        if(sibling) {
          currIndex = sibling.classList.contains('gu-mirror') ? -1 : sibling.dataset.index > prevIndex ? (sibling.dataset.index | 0) - 1 : sibling.dataset.index | 0;
        }

        self.emit('reorderItem', prevIndex, currIndex);
      });
    });

    this.controller = new Controller({
      model: opts.model,
      view: this.view,
      events: opts.events
    });
  }
}

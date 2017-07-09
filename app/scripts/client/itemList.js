import View from './Views/View.js';
import Controller from './Controllers/Controller.js';
import Handlebars from 'hbsfy/runtime';

Handlebars.registerHelper('isActive', function(options) {
  if (options.hash.index === (options.hash.itemActive | 0)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

export default class ItemList {
  constructor(model) {
    // this.model = model;
    this.view = new View({
      model: model,
      container: '.item-list',
      events: {
        'item:click': function(e) {
          const index = e.currentTarget.dataset.index;
          this.emit('change', 'itemActive', index);
        },
        'item:dragstart': function(e) {
          console.log('dragStart', e);
        },
        'item:dragend': function(e) {
          
        }
      },
      template: require('../../templates/ItemList.hbs'),
    });
    this.controller = new Controller({
      model: model,
      view: this.view,
    });
  }
}

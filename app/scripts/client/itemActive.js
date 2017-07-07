import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

export default class ItemActive {
  constructor(model) {
    this.model = model;
    this.view = new View({
      model: this.model,
      container: '.item-active',
      events: {
        'deleteItem:click': (e) => {
          console.log(e);
        },
      },
      template: require('../../templates/ItemActive.hbs'),
    });
    this.controller = new Controller({
      model: this.model,
      view: this.view,
    });
  }
}

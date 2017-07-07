import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

export default class ItemList {
  constructor(model) {
    this.model = model;
    this.view = new View({
      model: this.model,
      container: '.item-list',
      events: {

      },
      template: require('../../templates/ItemList.hbs'),
    });
    this.controller = new Controller({
      model: this.model,
      view: this.view,
    });
  }
}

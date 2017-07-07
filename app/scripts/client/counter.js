import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

export default class Counter {
  constructor(model) {
    this.model = model;
    this.view = new View({
      model: model,
      container: '.counter',
      events: {

      },
      template: require('../../templates/Counter.hbs'),
    });
    this.controller = new Controller({
      model: model,
      view: this.view,
    });
  }
}

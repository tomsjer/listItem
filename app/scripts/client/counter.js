import View from './Views/View.js';
import Controller from './Controllers/Controller.js';
import Handlebars from 'hbsfy/runtime';

Handlebars.registerHelper('addOne', function(options) {
  const cont = options.fn(this) | 0;
  return cont + 1;
});

export default class Counter {
  constructor(opts) {
    this.model = opts.model;
    this.view = new View({
      model: this.model,
      container: '.counter',
      events: {

      },
      template: require('../../templates/Counter.hbs'),
    });
    this.controller = new Controller({
      model: this.model,
      view: this.view,
    });
  }
}

import Model from './Models/Model.js';
import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

export default class Notifications {
  constructor(opts) {
    this.model = new Model(opts.model);
    opts.view.model = this.model;
    this.view = new View( opts.view );
    this.controller = new Controller({
      model: this.model,
      view: this.view,
    });
  }
}

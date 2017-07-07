import EventEmitter from 'events';

export default class Controller extends EventEmitter {
  constructor(opts) {
    super(opts);
    this.model = opts.model;
    this.view = opts.view;

    this.view.setModel(this.model);

    this.view.on('change', this.updateModel.bind(this));
    this.model.on('change', this.updateView.bind(this));

    // Maybe leave concrete implementation to instance.
    // if(!this.view.noUpdate) {
      // this.view.render();
    // }
  }
  render() {
    this.view.render();
  }
  updateModel(attribute, value) {
    this.model.set(attribute, value);
  }
  updateView(prop) {
    this.view.update(prop);
  }
}

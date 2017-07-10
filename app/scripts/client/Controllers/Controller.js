import EventEmitter from 'events';

export default class Controller extends EventEmitter {
  constructor(opts) {
    super(opts);
    this.model = opts.model;
    this.view = opts.view;
    this.events = opts.events;

    this.view.on('change', this.updateModel.bind(this));
    this.view.on('afterRender', this.bindEvents.bind(this));
    this.view.on('beforeDestroy', this.unbindEvents.bind(this));
    this.model.on('change', this.updateView.bind(this));

    this.view.setModel(this.model);

    // Maybe leave concrete implementation to instance.
    if(!this.view.noUpdate) {
     // this.view.render();
    }
  }
  render() {
    this.view.render();
  }
  updateModel(attribute, value) {
    this.model.set(attribute, value);
  }
  updateView(prop) {
    if(!this.view.noUpdate) {
      this.view.update(prop);
    }
  }
  bindEvents() {
    for(const i in this.events) {
      this.view.on(i, this.events[i]);
    }
  }
  unbindEvents() {
    for(const i in this.events) {
      this.view.removeListener(i, this.events[i]);
    }
  }
}

import EventEmitter from 'events';

export default class View extends EventEmitter {
  constructor(opts) {
    super(opts);

    this.container = opts.container;
    this.events = opts.events;
    this.template = opts.template;

    this.on('upate', this.update);
    this.on('afterRender', this.bindEvents);
    this.on('beforeDestroy', this.unbindEvents);
  }
  update(prop) {
    this.destroy();
    this.render();
  }
  render() {
    this.emit('beforeRender');
    this.container.innerHTML = this.template(this.model.getJSON());
    this.emit('afterRender');
  }
  destroy() {
    this.emit('beforeDestroy');
    this.container.innerHTML = '';
    this.emit('afterDestroy');
  }
  bindEvents() {
    for (const i in this.events) {
      const arr = i.split(':');
      const selector = `[data-bind="${arr[0]}"]`;
      const event = arr[1];
      const handler = typeof this.events[i] === 'function' ? this.events[i] : this[this.events[i]];
    
      this.container.querySelector(selector)
      .addEventListener(event, handler.bind(this));
    }
  }
  unbindEvents() {
    for (const i in this.events) {
      const arr = i.split(':');
      const selector = `[data-bind="${arr[0]}"]`;
      const event = arr[1];
      const handler = typeof this.events[i] === 'function' ? this.events[i] : this[this.events[i]];
      const el = this.container.querySelector(selector);
      if(el) {
        el.removeEventListener(event, handler);
      }
    }
  }
  setModel(model) {
    this.model = model;
  }
}

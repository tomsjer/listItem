import EventEmitter from 'events';

export default class View extends EventEmitter {
  constructor(opts) {
    super(opts);

    this.noUpdate = opts.noUpdate || false;
    this.container = opts.container;
    this.model = opts.model;
    this.events = opts.events;
    this.template = opts.template;

    this.on('upate', this.update);
    this.on('afterRender', this.bindEvents);
    this.on('beforeDestroy', this.unbindEvents);
  }
  update(prop) {
    if (this.noUpdate) { return; }
    this.destroy();
    this.render();
  }
  render() {
    const container = typeof this.container === 'string' ?
                      document.querySelector(this.container) : this.container;
    if (container) {
      this.emit('beforeRender');
      container.innerHTML = this.template(this.model.getJSON());
      this.emit('afterRender');
    }
    else {
      console.log(this, 'container is null');
    }
  }
  destroy() {
    const container = typeof this.container === 'string' ?
                      document.querySelector(this.container) : this.container;
    if (container) {
      this.emit('beforeDestroy');
      container.innerHTML = '';
      this.emit('afterDestroy');
    }
    else {
      console.log(this, 'container is null');
    }
  }
  bindEvents() {
    for (const i in this.events) {
      const arr = i.split(':');
      const selector = `[data-bind="${arr[0]}"]`;
      const event = arr[1];
      const handler = typeof this.events[i] === 'function' ? this.events[i].bind(this) : this[this.events[i]].bind(this);
      const container = typeof this.container === 'string' ?
                      document.querySelector(this.container) : this.container;
      const el = container.querySelectorAll(selector);
      if(el) {
        el.forEach(e => e.addEventListener(event, handler.bind(this)));
      }
    }
  }
  unbindEvents() {
    for (const i in this.events) {
      const arr = i.split(':');
      const selector = `[data-bind="${arr[0]}"]`;
      const event = arr[1];
      const handler = typeof this.events[i] === 'function' ? this.events[i] : this[this.events[i]];
      const container = typeof this.container === 'string' ?
                      document.querySelector(this.container) : this.container;
      const el = container.querySelectorAll(selector);
      if(el) {
        el.forEach(e => e.removeEventListener(event, handler));
      }
    }
  }
  setModel(model) {
    this.model = model;
  }
}
